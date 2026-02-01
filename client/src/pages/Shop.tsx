import { useState, useEffect, useRef } from "react";
// Prevent duplicate order processing
const processingStripeOrders = new Set<string>();

import { Navbar } from "@/components/layout/Navbar";
import {
  Trash2,
  Plus,
  Minus,
  X,
  AlertCircle,
  CreditCard,
  Wallet,
  Heart,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";
import { BeatCard } from "@/components/store/BeatCard";
import ContractModal from "@/components/Shop/ContractModal";
import { beats } from "@/lib/data";
import { motion } from "framer-motion";

type PaymentMethod = "stripe" | "paypal" | "crypto";
type ViewMode = "cart" | "favorites";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51Spw6HG4NUYiO6WbvkHI9nZxHSWSGUho6J9ZXinBUCpEt3BCdN78JffsCnPetEJIXTtwE6jRDdO7DIrlvMvZZlP1008shelj29",
);

// PayPal Plan IDs
const PAYPAL_PLAN_IDS = {
  "subscription-gold": "P-398129005T965961NNFYZVCI",
  "subscription-diamond": "P-55L371070A602070FNFYZVCQ",
  "subscription-platinum": "P-1MY38620WT494822WNFYZVCY",
};

// Add global type for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}

export default function Shop() {
  const [, setLocation] = useLocation();
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } =
    useCart();
  const { user, openAuthModal, userProfile } = useAuth();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("stripe");
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [stripePopup, setStripePopup] = useState<Window | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);

  // NEW: View mode state and favorites
  const [viewMode, setViewMode] = useState<ViewMode>("cart");
  const [favoriteBeats, setFavoriteBeats] = useState<any[]>([]);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // NEW: Fetch favorites when user changes or view switches to favorites
  useEffect(() => {
    if (viewMode === "favorites" && user) {
      fetchFavorites();
    }
  }, [viewMode, user]);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoadingFavorites(true);
    try {
      const { data: favorites, error } = await supabase
        .from("favorites")
        .select("beat_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (favorites) {
        const favoriteBeatIds = favorites.map((f) => f.beat_id);
        const matchedBeats = beats.filter((beat) =>
          favoriteBeatIds.includes(beat.id),
        );
        setFavoriteBeats(matchedBeats);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  // Monitor Stripe popup for completion
  useEffect(() => {
    if (!stripePopup) return;

    const checkPopup = setInterval(() => {
      if (stripePopup.closed) {
        clearInterval(checkPopup);
        setStripePopup(null);
        //         checkStripePaymentStatus();
      }
    }, 500);

    return () => clearInterval(checkPopup);
  }, [stripePopup]);

  const validItems = items.filter(
    (item) => item && typeof item.price === "number",
  );

  const tax = 0;
  const total = subtotal;

  const beatItems = validItems.filter(
    (item) =>
      item.id !== "royalty-token" && !item.id.startsWith("subscription-"),
  );
  const totalBeats = beatItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  const hasSubscription = validItems.some((item) =>
    item.id.startsWith("subscription-"),
  );

  const isCryptoDisabled = hasSubscription;

  // Auto-switch from crypto to stripe if subscription added to cart
  useEffect(() => {
    if (selectedPaymentMethod === "crypto" && hasSubscription) {
      setSelectedPaymentMethod("stripe");
    }
  }, [hasSubscription, selectedPaymentMethod]);

  const checkStripePaymentStatus = async () => {
    const paymentSuccess = localStorage.getItem("stripe_payment_success");
    const sessionId = localStorage.getItem("stripe_session_id");

    if (paymentSuccess === "true" && sessionId) {
      console.log("Stripe payment success detected");
      localStorage.removeItem("stripe_payment_success");
      localStorage.removeItem("stripe_session_id");
      await handleStripeSuccess(sessionId);
    }
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "STRIPE_PAYMENT_SUCCESS") {
        console.log(
          "[DEBUG] Message listener triggered with sessionId:",
          event.data.sessionId,
        );
        console.log("Received payment success message from popup");
        await handleStripeSuccess(event.data.sessionId);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const royaltyTokens = validItems.find((item) => item.id === "royalty-token");
  const tokenCount = royaltyTokens ? royaltyTokens.quantity : 0;
  const hasActiveMembership =
    userProfile?.subscription_tier &&
    userProfile.subscription_tier !== "tier_zero";

  const hasProperLicensing =
    hasActiveMembership || hasSubscription || tokenCount >= totalBeats;

  // FIXED: PayPal useEffect with corrected cleanup and dependencies
  useEffect(() => {
    if (
      showPaymentModal &&
      selectedPaymentMethod === "paypal" &&
      paypalRef.current &&
      window.paypal &&
      validItems.length > 0
    ) {
      // Clear any existing PayPal buttons
      paypalRef.current.innerHTML = "";

      const subscriptionItem = validItems.find((item) =>
        item.id.startsWith("subscription-"),
      );

      if (subscriptionItem) {
        // PayPal Subscription Flow
        const planId =
          PAYPAL_PLAN_IDS[subscriptionItem.id as keyof typeof PAYPAL_PLAN_IDS];

        if (!planId) {
          console.error("Invalid subscription type for PayPal");
          return;
        }

        window.paypal
          .Buttons({
            createSubscription: (data: any, actions: any) => {
              return actions.subscription.create({
                plan_id: planId,
              });
            },
            onApprove: async (data: any, actions: any) => {
              await handlePayPalSubscriptionSuccess(
                data.subscriptionID,
                subscriptionItem,
              );
            },
            onError: (err: any) => {
              console.error("PayPal Subscription Error:", err);
              alert("PayPal subscription failed. Please try again.");
            },
          })
          .render(paypalRef.current);
      } else {
        // Original one-time payment flow
        window.paypal
          .Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: total.toFixed(2),
                      breakdown: {
                        item_total: {
                          value: subtotal.toFixed(2),
                          currency_code: "USD",
                        },
                      },
                    },
                    items: validItems.map((item) => ({
                      name: item.title || "Unknown Item",
                      description: `By ${item.artist || "Unknown Artist"}`,
                      unit_amount: {
                        value: (item.price || 0).toFixed(2),
                        currency_code: "USD",
                      },
                      quantity: item.quantity || 1,
                    })),
                  },
                ],
              });
            },
            onApprove: async (data: any, actions: any) => {
              const order = await actions.order.capture();
              await handlePaymentSuccess(order.id, "paypal");
            },
            onError: (err: any) => {
              console.error("PayPal Error:", err);
              alert("PayPal payment failed. Please try again.");
            },
          })
          .render(paypalRef.current);
      }
    }

    // FIXED: Only cleanup when modal closes or payment method changes
    return () => {
      if (
        paypalRef.current &&
        (!showPaymentModal || selectedPaymentMethod !== "paypal")
      ) {
        paypalRef.current.innerHTML = "";
      }
    };
  }, [showPaymentModal, selectedPaymentMethod, validItems.length]);
  // FIXED: Removed 'total' and 'subtotal' from dependencies

  const handlePayPalSubscriptionSuccess = async (
    subscriptionId: string,
    subscriptionItem: any,
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        let newTier = "tier_zero";

        if (subscriptionItem.id === "subscription-gold") {
          newTier = "gold";
        } else if (subscriptionItem.id === "subscription-diamond") {
          newTier = "diamond";
        } else if (subscriptionItem.id === "subscription-platinum") {
          newTier = "platinum";
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            subscription_tier: newTier,
            paypal_subscription_id: subscriptionId,
            subscription_provider: "paypal",
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating subscription tier:", updateError);
          alert(
            "Subscription created but failed to update profile. Please contact support.",
          );
          return;
        }

        console.log("PayPal subscription created:", subscriptionId);
      }
    } catch (error) {
      console.error("Error processing PayPal subscription:", error);
      alert(
        "There was an error processing your subscription. Please contact support.",
      );
      return;
    }

    clearCart();
    setShowPaymentModal(false);
    alert("Subscription successful! Your membership is now active.");
    setLocation("/profile");
  };

  const handlePaymentSuccess = async (
    transactionId: string,
    method: PaymentMethod,
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Create the order first
        const { data: orderData, error } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            payment_method: method,
            transaction_id: transactionId,
            items: validItems,
            subtotal: subtotal,
            tax: tax,
            total: total,
            status: "completed",
          })
          .select()
          .single();

        if (error) {
          console.error("Error saving order:", error);
        }

        // NEW: Insert legal acceptance record
        if (orderData) {
          const acceptanceData = sessionStorage.getItem(
            "pending_legal_acceptance",
          );

          if (acceptanceData) {
            const parsedAcceptance = JSON.parse(acceptanceData);

            const { error: legalError } = await supabase
              .from("legal_acceptances")
              .insert({
                user_id: user.id,
                order_id: orderData.id,
                tos_accepted: parsedAcceptance.tos_accepted,
                privacy_accepted: parsedAcceptance.privacy_accepted,
                refund_policy_accepted: parsedAcceptance.refund_policy_accepted,
                licensing_accepted: parsedAcceptance.licensing_accepted,
                accepted_at: parsedAcceptance.accepted_at,
                tos_version: parsedAcceptance.tos_version,
                privacy_version: parsedAcceptance.privacy_version,
                refund_policy_version: parsedAcceptance.refund_policy_version,
                licensing_version: parsedAcceptance.licensing_version,
                user_agent: parsedAcceptance.user_agent,
                ip_address: "client-side", // Will be updated by backend if needed
              });

            if (legalError) {
              console.error("Error saving legal acceptance:", legalError);
            } else {
              console.log("Legal acceptance saved successfully");
              sessionStorage.removeItem("pending_legal_acceptance");
            }
          }
        }

        const subscriptionItem = validItems.find((item) =>
          item.id.startsWith("subscription-"),
        );

        if (subscriptionItem) {
          let newTier = "tier_zero";

          if (subscriptionItem.id === "subscription-gold") {
            newTier = "gold";
          } else if (subscriptionItem.id === "subscription-diamond") {
            newTier = "diamond";
          } else if (subscriptionItem.id === "subscription-platinum") {
            newTier = "platinum";
          }

          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              subscription_tier: newTier,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          if (updateError) {
            console.error("Error updating subscription tier:", updateError);
          } else {
            console.log("Subscription tier updated to:", newTier);
          }
        }
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }

    clearCart();
    setShowPaymentModal(false);
    alert("Payment successful! Your purchase has been completed.");
    setLocation("/downloads");
  };

  const handleStripeCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        alert("Stripe failed to load. Please try again.");
        return;
      }

      console.log("Valid items in cart:", validItems);
      // Check if cart contains a subscription
      const subscriptionItem = validItems.find((item) =>
        item.id.startsWith("subscription-"),
      );

      // If there's a subscription, use the subscription checkout
      if (subscriptionItem) {
        // Map subscription IDs to Stripe Price IDs
        const priceIdMap: { [key: string]: string } = {
          "subscription-gold": "price_1Ss6foG4NUYiO6WbQSJZ9s7O",
          "subscription-diamond": "price_1Ss6myG4NUYiO6Wbd8f2yjTW",
          "subscription-platinum": "price_1Ss6pYG4NUYiO6WbLyD6dqjf",
        };

        const priceId = priceIdMap[subscriptionItem.id];

        if (!priceId) {
          alert("Invalid subscription type");
          return;
        }

        console.log("Creating subscription checkout for:", subscriptionItem.id);

        const response = await fetch(
          "https://tciugratutxxrdtbsxim.supabase.co/functions/v1/create-stripe-subscription",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaXVncmF0dXR4eHJkdGJzeGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NzYwMDgsImV4cCI6MjA4MzA1MjAwOH0.-yif_fwvYOwE6kG4nkSc1HXyF-cHTlZGWGJ91YXsPuM",
            },
            body: JSON.stringify({
              priceId: priceId,
              userId: user?.id,
              userEmail: user?.email,
              successUrl: `${window.location.origin}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
              cancelUrl: `${window.location.origin}/shop`,
            }),
          },
        );

        const data = await response.json();
        console.log("Subscription response:", data);

        if (data.error) {
          console.error("Subscription error:", data.error);
          throw new Error(data.error);
        }

        if (data.url) {
          const width = 600;
          const height = 800;
          const left = (window.screen.width - width) / 2;
          const top = (window.screen.height - height) / 2;

          const popup = window.open(
            data.url,
            "stripe-checkout",
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`,
          );

          if (popup) {
            setStripePopup(popup);
            setShowPaymentModal(false);
          } else {
            alert("Please allow popups to complete checkout");
          }
        } else {
          throw new Error("No checkout URL returned from server");
        }
      } else {
        // Original one-time payment checkout logic
        const lineItems = validItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title || "Unknown Item",
              description: `By ${item.artist || "Unknown Artist"}`,
            },
            unit_amount: Math.round((item.price || 0) * 100),
            tax_behavior: "exclusive",
          },
          quantity: item.quantity || 1,
        }));

        const cartBackup = {
          items: validItems,
          subtotal: subtotal,
          timestamp: Date.now(),
        };
        localStorage.setItem("stripe_cart_backup", JSON.stringify(cartBackup));

        console.log("Sending checkout request with:", {
          lineItems,
          userId: user?.id,
          userEmail: user?.email,
          itemCount: validItems.length, // Changed: only send count instead of full items
        });

        // FIXED: Don't send full items array, only metadata
        const response = await fetch(
          "https://tciugratutxxrdtbsxim.supabase.co/functions/v1/create-stripe-checkout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaXVncmF0dXR4eHJkdGJzeGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NzYwMDgsImV4cCI6MjA4MzA1MjAwOH0.-yif_fwvYOwE6kG4nkSc1HXyF-cHTlZGWGJ91YXsPuM",
            },
            body: JSON.stringify({
              lineItems,
              userId: user?.id,
              userEmail: user?.email,
              // FIXED: Only send minimal metadata instead of full items array
              metadata: {
                itemCount: validItems.length,
                totalAmount: total.toFixed(2),
                hasLicense: validItems.some((item) =>
                  item.id.startsWith("license-"),
                ),
              },
              successUrl: `${window.location.origin}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
              cancelUrl: `${window.location.origin}/cancel`,
            }),
          },
        );

        const data = await response.json();
        console.log("Stripe response:", data);

        if (data.error) {
          console.error("Stripe error details:", data.error);
          throw new Error(data.error);
        }

        if (data.url) {
          const width = 600;
          const height = 800;
          const left = (window.screen.width - width) / 2;
          const top = (window.screen.height - height) / 2;

          const popup = window.open(
            data.url,
            "stripe-checkout",
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`,
          );

          if (popup) {
            setStripePopup(popup);
            setShowPaymentModal(false);
          } else {
            alert("Please allow popups to complete checkout");
          }
        } else {
          throw new Error("No checkout URL returned from server");
        }
      }
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      alert(`Payment failed: ${error.message}`);
    }
  };

  const handleStripeSuccess = async (sessionId: string) => {
    console.log(
      "[DEBUG] handleStripeSuccess called with sessionId:",
      sessionId,
    );
    try {
      // Prevent double processing - check both memory and storage
      const processedKey = `stripe_processed_${sessionId}`;
      if (
        processingStripeOrders.has(sessionId) ||
        sessionStorage.getItem(processedKey)
      ) {
        console.log("[DEBUG] Already processing this session, skipping");
        return;
      }

      processingStripeOrders.add(sessionId);
      console.log("[DEBUG] Added session to processing set:", sessionId);
      sessionStorage.setItem(processedKey, "true");

      let cartItems = [];
      let calculatedSubtotal = 0;

      const backupData = localStorage.getItem("stripe_cart_backup");
      if (backupData) {
        try {
          const backup = JSON.parse(backupData);
          cartItems = backup.items;
          calculatedSubtotal = backup.subtotal;
          console.log("Retrieved cart from backup:", cartItems);
          localStorage.removeItem("stripe_cart_backup");
        } catch (e) {
          console.error("Error parsing backup:", e);
        }
      }

      if (!cartItems || cartItems.length === 0) {
        const cartData = localStorage.getItem("elixir_cart");
        if (cartData) {
          try {
            cartItems = JSON.parse(cartData);
            calculatedSubtotal = cartItems.reduce(
              (sum: number, item: any) => sum + item.price * item.quantity,
              0,
            );
            console.log("Retrieved cart from localStorage:", cartItems);
          } catch (e) {
            console.error("Error parsing cart from localStorage:", e);
          }
        }
      }

      if (!cartItems || cartItems.length === 0) {
        cartItems = validItems;
        calculatedSubtotal = subtotal;
        console.log("Using validItems as fallback:", cartItems);
      }

      if (cartItems.length === 0) {
        console.error("No items found in cart after Stripe payment");
        alert(
          "Error: No items found. Please contact support with session ID: " +
            sessionId,
        );
        return;
      }

      console.log("Saving order with items:", cartItems);

      const { data: orderData, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          payment_method: "stripe",
          transaction_id: sessionId,
          items: cartItems,
          subtotal: calculatedSubtotal,
          tax: 0,
          total: calculatedSubtotal,
          status: "completed",
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving Stripe order:", error);
        // Check if this is a duplicate transaction error (unique constraint violation)
        if (
          error.code === "23505" ||
          error.message?.includes("unique_transaction_id")
        ) {
          console.log(
            "Order already exists for this transaction, skipping duplicate",
          );
          // Continue as if successful - order already exists
        } else {
          alert(
            "Payment successful but there was an error saving your order. Please contact support.",
          );
          return;
        }
      }

      console.log("Order saved successfully!");

      // Update profile with order_id  console.log("Order saved successfully!");
      // Save legal acceptance record
      if (orderData) {
        const acceptanceData = sessionStorage.getItem(
          "pending_legal_acceptance",
        );
        if (acceptanceData) {
          const parsedAcceptance = JSON.parse(acceptanceData);
          const { error: legalError } = await supabase
            .from("legal_acceptances")
            .insert({
              user_id: user.id,
              order_id: orderData.id,
              tos_accepted: parsedAcceptance.tos_accepted,
              privacy_accepted: parsedAcceptance.privacy_accepted,
              refund_policy_accepted: parsedAcceptance.refund_policy_accepted,
              licensing_accepted: parsedAcceptance.licensing_accepted,
              accepted_at: parsedAcceptance.accepted_at,
              tos_version: parsedAcceptance.tos_version,
              privacy_version: parsedAcceptance.privacy_version,
              refund_policy_version: parsedAcceptance.refund_policy_version,
              licensing_version: parsedAcceptance.licensing_version,
              user_agent: parsedAcceptance.user_agent,
              ip_address: "client-side",
            });
          if (legalError) {
            console.error("Error saving legal acceptance:", legalError);
          } else {
            console.log("Legal acceptance saved successfully");
            sessionStorage.removeItem("pending_legal_acceptance");
          }
        }
      }
      // Update profile with order_id
      if (orderData) {
        await updateProfileWithOrderId(user.id, orderData.id);
      }

      const subscriptionItem = cartItems.find((item: any) =>
        item.id.startsWith("subscription-"),
      );

      if (subscriptionItem) {
        let newTier = "tier_zero";

        if (subscriptionItem.id === "subscription-gold") {
          newTier = "gold";
        } else if (subscriptionItem.id === "subscription-diamond") {
          newTier = "diamond";
        } else if (subscriptionItem.id === "subscription-platinum") {
          newTier = "platinum";
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            subscription_tier: newTier,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating subscription tier:", updateError);
        } else {
          console.log("Subscription tier updated to:", newTier);
        }
      }

      clearCart();
      alert("Payment successful! Your purchase has been completed.");
      setLocation("/downloads");
    } catch (error) {
      console.error("Error processing Stripe success:", error);
      alert(
        "There was an error processing your order. Please contact support.",
      );
    }
  };

  const handleCryptoCheckout = async () => {
    try {
      console.log("Crypto checkout initiated");

      const response = await fetch(
        "https://tciugratutxxrdtbsxim.supabase.co/functions/v1/create-coinbase-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaXVncmF0dXR4eHJkdGJzeGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NzYwMDgsImV4cCI6MjA4MzA1MjAwOH0.-yif_fwvYOwE6kG4nkSc1HXyF-cHTlZGWGJ91YXsPuM",
          },
          body: JSON.stringify({
            amount: total,
            description: `3LIXIR MUSIC - ${totalBeats} beat${totalBeats > 1 ? "s" : ""}`,
            userId: user?.id,
            userEmail: user?.email,
            items: validItems,
            metadata: {
              orderType: "beat_purchase",
            },
          }),
        },
      );

      console.log("Response received:", response.status);
      console.log("About to parse JSON");
      const data = await response.json();
      console.log("Data received:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.hostedUrl) {
        // Open Coinbase Commerce checkout in new window
        const width = 500;
        const height = 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        window.open(
          data.hostedUrl,
          "coinbase-checkout",
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`,
        );

        setShowPaymentModal(false);

        // Show a message that payment is processing
        alert(
          "Complete your payment in the Coinbase Commerce window. You'll be redirected back when done.",
        );
      }
    } catch (error: any) {
      console.error("Crypto checkout error:", error);
      alert(`Payment failed: ${error.message}`);
    }
  };

  const handleContractAccept = async (emailSubscription: boolean) => {
    setContractAccepted(true);
    setShowContractModal(false);

    try {
      // Get user agent and IP (IP will be captured on backend)
      const userAgent = navigator.userAgent;

      // Store acceptance data temporarily to use after order creation
      const acceptanceData = {
        tos_accepted: true,
        refund_policy_accepted: true,
        licensing_accepted: true,
        privacy_accepted: true,
        accepted_at: new Date().toISOString(),
        tos_version: "1.0",
        privacy_version: "1.0",
        refund_policy_version: "1.0",
        licensing_version: "1.0",
        user_agent: userAgent,
      };

      // Store in sessionStorage to use after order creation
      sessionStorage.setItem(
        "pending_legal_acceptance",
        JSON.stringify(acceptanceData),
      );

      console.log("Legal acceptance data stored, will be saved with order");
      setProcessingPayment(false);
    } catch (error) {
      console.error("Error storing agreement:", error);
    }

    setShowPaymentModal(true);
  };

  const updateProfileWithOrderId = async (userId: string, orderId: string) => {
    try {
      const { data: profiles, error: fetchError } = await supabase
        .from("profile")
        .select("id")
        .eq("user_id", userId)
        .is("order_id", null)
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        return;
      }

      if (profiles && profiles.length > 0) {
        const { error: updateError } = await supabase
          .from("profile")
          .update({ order_id: orderId })
          .eq("id", profiles[0].id);

        if (updateError) {
          console.error("Error updating profile with order_id:", updateError);
        } else {
          console.log("Profile updated with order_id successfully");
        }
      }
    } catch (error) {
      console.error("Error in updateProfileWithOrderId:", error);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    const hasBeats = beatItems.length > 0;

    if (hasBeats && !hasProperLicensing) {
      setShowLicenseModal(true);
      return;
    }

    // Always show contract modal for all purchases
    setContractAccepted(false);
    setShowContractModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Contract Modal */}
      <ContractModal
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        onAccept={handleContractAccept}
        beatTitles={beatItems.map((item) => item.title)}
      />

      {/* Licensing Required Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <div className="bg-background border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowLicenseModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 mb-6 mx-auto">
              <AlertCircle className="w-8 h-8 text-[hsl(var(--gold))]" />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-center">
              Licensing Required
            </h2>

            <p className="text-muted-foreground text-center mb-8">
              You have {totalBeats} beat{totalBeats > 1 ? "s" : ""} in your
              cart.
              {tokenCount > 0 &&
                ` You currently have ${tokenCount} royalty token${tokenCount > 1 ? "s" : ""}.`}{" "}
              You need{" "}
              {hasSubscription
                ? "proper licensing"
                : tokenCount < totalBeats
                  ? `${totalBeats - tokenCount} more token${totalBeats - tokenCount > 1 ? "s" : ""}`
                  : "a subscription or tokens"}{" "}
              to proceed with checkout.
            </p>

            <Button
              onClick={() => {
                setShowLicenseModal(false);
                setLocation("/licenses");
              }}
              className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-6 text-sm font-bold uppercase tracking-widest mb-4"
            >
              View Licensing Plans
            </Button>

            <button
              onClick={() => setShowLicenseModal(false)}
              className="w-full text-sm text-muted-foreground hover:text-white transition-colors"
            >
              Back to Cart
            </button>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-white/10 rounded-2xl p-8 max-w-lg w-full relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>

            {hasSubscription && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-400 mb-1">
                    Subscription in Cart
                  </p>
                  <p className="text-blue-300">
                    Cryptocurrency payments are not available for subscriptions.
                    Please use Stripe or PayPal for automatic recurring billing.
                  </p>
                </div>
              </div>
            )}

            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground text-sm">Tax</span>
                <span className="text-sm text-muted-foreground">
                  Calculated at checkout
                </span>
              </div>
              <div className="h-px bg-white/10 my-3"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-[hsl(var(--gold))]">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Final amount including tax will be shown at checkout
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Select Payment Method
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => setSelectedPaymentMethod("stripe")}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                    selectedPaymentMethod === "stripe"
                      ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === "stripe"
                        ? "border-[hsl(var(--gold))]"
                        : "border-white/30"
                    }`}
                  >
                    {selectedPaymentMethod === "stripe" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--gold))]"></div>
                    )}
                  </div>
                  <CreditCard className="w-6 h-6 text-[hsl(var(--gold))]" />
                  <div className="flex-grow text-left">
                    <div className="font-semibold">Credit / Debit Card</div>
                    <div className="text-sm text-muted-foreground">
                      Pay with Stripe
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-8 h-5 bg-white rounded text-[10px] flex items-center justify-center font-bold text-black">
                      VISA
                    </div>
                    <div className="w-8 h-5 bg-red-500 rounded text-[10px] flex items-center justify-center font-bold">
                      MC
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPaymentMethod("paypal")}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                    selectedPaymentMethod === "paypal"
                      ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === "paypal"
                        ? "border-[hsl(var(--gold))]"
                        : "border-white/30"
                    }`}
                  >
                    {selectedPaymentMethod === "paypal" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--gold))]"></div>
                    )}
                  </div>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#00457C">
                    <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 01-.794.68H7.72a.483.483 0 01-.477-.558L9.213 7.25a.964.964 0 01.952-.806h4.92c.947 0 1.748.098 2.397.32 1.124.386 1.815 1.15 2.085 2.306z" />
                  </svg>
                  <div className="flex-grow text-left">
                    <div className="font-semibold">PayPal</div>
                    <div className="text-sm text-muted-foreground">
                      Fast & secure
                    </div>
                  </div>
                </button>

                <button
                  onClick={() =>
                    !isCryptoDisabled && setSelectedPaymentMethod("crypto")
                  }
                  disabled={isCryptoDisabled}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                    isCryptoDisabled
                      ? "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
                      : selectedPaymentMethod === "crypto"
                        ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5"
                        : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === "crypto" && !isCryptoDisabled
                        ? "border-[hsl(var(--gold))]"
                        : "border-white/30"
                    }`}
                  >
                    {selectedPaymentMethod === "crypto" &&
                      !isCryptoDisabled && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--gold))]"></div>
                      )}
                  </div>
                  <Wallet
                    className={`w-6 h-6 ${isCryptoDisabled ? "text-white/30" : "text-[hsl(var(--gold))]"}`}
                  />
                  <div className="flex-grow text-left">
                    <div
                      className={`font-semibold ${isCryptoDisabled ? "text-white/50" : ""}`}
                    >
                      Cryptocurrency
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isCryptoDisabled
                        ? "Not available for subscriptions"
                        : "BTC, ETH, USDC & more"}
                    </div>
                  </div>
                  {isCryptoDisabled && (
                    <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400 font-medium">
                      Disabled
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              {selectedPaymentMethod === "stripe" && (
                <div className="space-y-4">
                  <Button
                    onClick={handleStripeCheckout}
                    className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-6 text-sm font-bold uppercase tracking-widest"
                  >
                    Continue to Checkout
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Secured by Stripe • Tax calculated automatically
                  </p>
                </div>
              )}

              {selectedPaymentMethod === "paypal" && (
                <div>
                  <div ref={paypalRef} className="mb-4"></div>
                  <p className="text-xs text-muted-foreground text-center">
                    Your payment is secured by PayPal
                  </p>
                </div>
              )}

              {selectedPaymentMethod === "crypto" && (
                <div>
                  {isCryptoDisabled ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold mb-2">
                        Crypto Not Available
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Cryptocurrency payments are only available for one-time
                        purchases. Subscriptions require Stripe or PayPal for
                        automatic billing.
                      </p>
                      <Button
                        onClick={() => setSelectedPaymentMethod("stripe")}
                        className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8"
                      >
                        Use Stripe Instead
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-16 h-16 text-[hsl(var(--gold))] mx-auto mb-4" />
                      <p className="text-muted-foreground mb-6">
                        Pay with Bitcoin, Ethereum, USDC, and other
                        cryptocurrencies
                      </p>
                      <Button
                        onClick={handleCryptoCheckout}
                        className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-6 text-sm font-bold uppercase tracking-widest"
                      >
                        Continue with Crypto
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        Powered by Coinbase Commerce
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => setViewMode("cart")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
                viewMode === "cart"
                  ? "bg-[hsl(var(--gold))] text-black"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Cart ({validItems.length})
            </button>
            <button
              onClick={() => setViewMode("favorites")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
                viewMode === "favorites"
                  ? "bg-[hsl(var(--gold))] text-black"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4" />
              Favorites ({favoriteBeats.length})
            </button>
          </div>

          {viewMode === "cart" && (
            <>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-12">
                Your Cart
              </h1>
              {validItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <svg
                      className="w-12 h-12 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Add some beats or licenses to get started
                  </p>
                  <Button
                    onClick={() => setLocation("/beats")}
                    className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest"
                  >
                    Browse Beats
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-6">
                    {validItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-6 p-6 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                      >
                        <div className="w-24 h-24 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden">
                          {item.cover ? (
                            <img
                              src={item.cover}
                              alt={item.title || "Item"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-12 h-12 text-[hsl(var(--gold))]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold mb-1">
                            {item.title || "Unknown Item"}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.artist || "Unknown Artist"}
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.quantity || 1) - 1,
                                )
                              }
                              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.quantity || 1) + 1,
                                )
                              }
                              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <span className="text-2xl font-bold text-[hsl(var(--gold))]">
                            $
                            {((item.price || 0) * (item.quantity || 1)).toFixed(
                              2,
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="lg:col-span-1">
                    <div className="border border-white/10 rounded-lg p-6 sticky top-24">
                      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                      {hasActiveMembership && (
                        <div className="mb-4 p-3 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/20 rounded-lg">
                          <p className="text-sm text-[hsl(var(--gold))] font-semibold">
                            ✓ Active{" "}
                            {userProfile?.subscription_tier?.toUpperCase()}{" "}
                            Member
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            No license purchase required
                          </p>
                        </div>
                      )}

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground text-sm">
                          <span>Tax</span>
                          <span>Calculated at checkout</span>
                        </div>
                        <div className="h-px bg-white/10"></div>
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total</span>
                          <span className="text-[hsl(var(--gold))]">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-6 text-sm font-bold uppercase tracking-widest mb-4"
                      >
                        {user ? "Proceed to Checkout" : "Sign In to Checkout"}
                      </Button>
                      <button
                        onClick={() => setLocation("/beats")}
                        className="w-full text-sm text-muted-foreground hover:text-white transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {viewMode === "favorites" && (
            <>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-12">
                Your Favorites
              </h1>

              {!user ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Heart className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Sign In to View Favorites
                  </h2>
                  <p className="text-muted-foreground mb-8 text-center max-w-md">
                    Create an account to save your favorite beats and access
                    them anytime.
                  </p>
                  <Button
                    onClick={openAuthModal}
                    className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest"
                  >
                    Sign In
                  </Button>
                </div>
              ) : loadingFavorites ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-[hsl(var(--gold))] animate-spin mb-4" />
                  <p className="text-muted-foreground">
                    Loading your favorites...
                  </p>
                </div>
              ) : favoriteBeats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Heart className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
                  <p className="text-muted-foreground mb-8 text-center max-w-md">
                    Start exploring our catalog and click the heart icon on any
                    beat to add it to your favorites.
                  </p>
                  <Button
                    onClick={() => setLocation("/beats")}
                    className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest"
                  >
                    Browse Beats
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6 text-muted-foreground text-sm">
                    {favoriteBeats.length} favorite
                    {favoriteBeats.length !== 1 ? "s" : ""}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favoriteBeats.map((beat, index) => (
                      <motion.div
                        key={beat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <BeatCard beat={beat} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="relative z-10 py-20 border-t border-yellow-500/20 bg-black-500/5">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold tracking-tighter text-white">
              3LIXIR MUSIC
            </h2>
          </div>
          <div className="flex justify-center gap-6 mb-8">
            <a
              href="#"
              className="relative z-10 text-yellow-500/60 hover:text-yellow-500 transition-colors text-sm uppercase tracking-wider cursor-pointer"
            >
              Instagram
            </a>
            <a
              href="#"
              className="relative z-10 text-yellow-500/60 hover:text-yellow-500 transition-colors text-sm uppercase tracking-wider cursor-pointer"
            >
              Twitter
            </a>
            <a
              href="https://www.youtube.com/@DJ3LIXIR"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 text-yellow-500/60 hover:text-yellow-500 transition-colors text-sm uppercase tracking-wider cursor-pointer"
            >
              YouTube
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-yellow-500/60">
            <a
              href="/info?section=terms"
              className="relative z-10 hover:text-yellow-500 transition-colors cursor-pointer"
            >
              Terms of Service
            </a>
            <span>•</span>
            <a
              href="/info?section=privacy"
              className="relative z-10 hover:text-yellow-500 transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/info?section=licensing"
              className="relative z-10 hover:text-yellow-500 transition-colors cursor-pointer"
            >
              Licensing Agreement
            </a>
            <span>•</span>
            <a
              href="/info?section=refund"
              className="relative z-10 hover:text-yellow-500 transition-colors cursor-pointer"
            >
              Refund Policy
            </a>
            <span>•</span>
            <a
              href="/info?section=copyright"
              className="relative z-10 hover:text-yellow-500 transition-colors cursor-pointer"
            >
              Copyright & DMCA
            </a>
          </div>
          <div className="text-center text-sm text-yellow-500/60 mt-8">
            © 2026 3LIXIR MUSIC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
