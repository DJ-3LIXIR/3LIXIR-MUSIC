import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import {
  Trash2,
  Plus,
  Minus,
  X,
  AlertCircle,
  CreditCard,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";

type PaymentMethod = "stripe" | "paypal" | "crypto";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51Spw6HG4NUYiO6WbvkHI9nZxHSWSGUho6J9ZXinBUCpEt3BCdN78JffsCnPetEJIXTtwE6jRDdO7DIrlvMvZZlP1008shelj29",
);

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("stripe");
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [stripePopup, setStripePopup] = useState<Window | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);

  // Monitor Stripe popup for completion
  useEffect(() => {
    if (!stripePopup) return;

    const checkPopup = setInterval(() => {
      if (stripePopup.closed) {
        clearInterval(checkPopup);
        setStripePopup(null);
        // Check for payment success via URL params or storage
        checkStripePaymentStatus();
      }
    }, 500);

    return () => clearInterval(checkPopup);
  }, [stripePopup]);

  // Check for successful Stripe payment
  const checkStripePaymentStatus = async () => {
    // Check localStorage for payment success flag set by popup
    const paymentSuccess = localStorage.getItem("stripe_payment_success");
    const sessionId = localStorage.getItem("stripe_session_id");

    if (paymentSuccess === "true" && sessionId) {
      console.log("Stripe payment success detected");

      // Clear the flags
      localStorage.removeItem("stripe_payment_success");
      localStorage.removeItem("stripe_session_id");

      await handleStripeSuccess(sessionId);
    }
  };

  // Listen for messages from popup window
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "STRIPE_PAYMENT_SUCCESS") {
        console.log("Received payment success message from popup");
        await handleStripeSuccess(event.data.sessionId);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Filter out any items with missing data
  const validItems = items.filter(
    (item) => item && typeof item.price === "number",
  );

  // Tax will be calculated by Stripe automatically
  const tax = 0;
  const total = subtotal;

  // Count beats (non-license items) in cart
  const beatItems = validItems.filter(
    (item) =>
      item.id !== "royalty-token" && !item.id.startsWith("subscription-"),
  );
  const totalBeats = beatItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  // Check if cart has subscription
  const hasSubscription = validItems.some((item) =>
    item.id.startsWith("subscription-"),
  );

  // Count royalty tokens in cart
  const royaltyTokens = validItems.find((item) => item.id === "royalty-token");
  const tokenCount = royaltyTokens ? royaltyTokens.quantity : 0;

  // Check if user already has active membership
  const hasActiveMembership =
    userProfile?.subscription_tier &&
    userProfile.subscription_tier !== "tier_zero";

  // Include active membership in licensing check
  const hasProperLicensing =
    hasActiveMembership || hasSubscription || tokenCount >= totalBeats;

  // Load PayPal buttons when PayPal is selected
  useEffect(() => {
    if (
      showPaymentModal &&
      selectedPaymentMethod === "paypal" &&
      paypalRef.current &&
      window.paypal &&
      validItems.length > 0
    ) {
      paypalRef.current.innerHTML = "";

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
        })
        .render(paypalRef.current);
    }
  }, [showPaymentModal, selectedPaymentMethod, total, validItems, subtotal]);

  const handlePaymentSuccess = async (
    transactionId: string,
    method: PaymentMethod,
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Save the order
        const { error } = await supabase.from("orders").insert({
          user_id: user.id,
          payment_method: method,
          transaction_id: transactionId,
          items: validItems,
          subtotal: subtotal,
          tax: tax,
          total: total,
          status: "completed",
        });

        if (error) {
          console.error("Error saving order:", error);
        }

        // Check if order contains a subscription and update user's tier
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

      // Create line items for Stripe with tax_behavior
      const lineItems = validItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title || "Unknown Item",
            description: `By ${item.artist || "Unknown Artist"}`,
            images: item.cover ? [item.cover] : [],
          },
          unit_amount: Math.round((item.price || 0) * 100),
          tax_behavior: "exclusive",
        },
        quantity: item.quantity || 1,
      }));

      // Store cart items in localStorage with a timestamp to ensure we have them after payment
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
        items: validItems,
      });

      // Call your Edge Function
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
            items: validItems,
            successUrl: `${window.location.origin}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/shop?payment=cancelled`,
          }),
        },
      );

      const data = await response.json();
      console.log("Stripe response:", data);

      if (data.error) {
        console.error("Stripe error details:", data.error);
        throw new Error(data.error);
      }

      // Open Stripe checkout in popup window
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
          // Close payment modal while popup is open
          setShowPaymentModal(false);
        } else {
          alert("Please allow popups to complete checkout");
        }
      } else {
        throw new Error("No checkout URL returned from server");
      }
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      alert(`Payment failed: ${error.message}`);
    }
  };

  const handleStripeSuccess = async (sessionId: string) => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        console.error("No user found after payment");
        alert("Please sign in to complete your order");
        return;
      }

      // Try multiple sources for cart items
      let cartItems = [];
      let calculatedSubtotal = 0;

      // 1. Try stripe_cart_backup first (most reliable)
      const backupData = localStorage.getItem("stripe_cart_backup");
      if (backupData) {
        try {
          const backup = JSON.parse(backupData);
          cartItems = backup.items;
          calculatedSubtotal = backup.subtotal;
          console.log("Retrieved cart from backup:", cartItems);
          // Clean up backup
          localStorage.removeItem("stripe_cart_backup");
        } catch (e) {
          console.error("Error parsing backup:", e);
        }
      }

      // 2. Fallback to regular cart
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

      // 3. Last fallback to validItems
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

      // Save the order
      const { error } = await supabase.from("orders").insert({
        user_id: currentUser.id,
        payment_method: "stripe",
        transaction_id: sessionId,
        items: cartItems,
        subtotal: calculatedSubtotal,
        tax: 0,
        total: calculatedSubtotal,
        status: "completed",
      });

      if (error) {
        console.error("Error saving Stripe order:", error);
        alert(
          "Payment successful but there was an error saving your order. Please contact support.",
        );
        return;
      }

      console.log("Order saved successfully!");

      // Check if order contains a subscription and update user's tier
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
          .eq("id", currentUser.id);

        if (updateError) {
          console.error("Error updating subscription tier:", updateError);
        } else {
          console.log("Subscription tier updated to:", newTier);
        }
      }

      // Clear the cart
      clearCart();

      // Show success message and redirect
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
    // TODO: Implement Coinbase Commerce checkout
    console.log("Crypto checkout initiated");
    alert("Crypto payment integration coming soon!");
  };

  const handleCheckout = () => {
    if (!user) {
      openAuthModal();
    } else if (totalBeats > 0 && !hasProperLicensing) {
      setShowLicenseModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Licensing Required Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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

            {/* Order Summary */}
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

            {/* Payment Method Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Select Payment Method
              </h3>

              <div className="space-y-3">
                {/* Stripe Option */}
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

                {/* PayPal Option */}
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

                {/* Crypto Option */}
                <button
                  onClick={() => setSelectedPaymentMethod("crypto")}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                    selectedPaymentMethod === "crypto"
                      ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === "crypto"
                        ? "border-[hsl(var(--gold))]"
                        : "border-white/30"
                    }`}
                  >
                    {selectedPaymentMethod === "crypto" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--gold))]"></div>
                    )}
                  </div>
                  <Wallet className="w-6 h-6 text-[hsl(var(--gold))]" />
                  <div className="flex-grow text-left">
                    <div className="font-semibold">Cryptocurrency</div>
                    <div className="text-sm text-muted-foreground">
                      BTC, ETH, USDC & more
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Interface */}
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
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 text-[hsl(var(--gold))] mx-auto mb-4" />
                  <p className="text-muted-foreground mb-6">
                    Pay with Bitcoin, Ethereum, USDC, and other cryptocurrencies
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
          </div>
        </div>
      )}

      <main className="pt-20">
        <div className="container mx-auto px-6 py-12">
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
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
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
                            updateQuantity(item.id, (item.quantity || 1) - 1)
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
                            updateQuantity(item.id, (item.quantity || 1) + 1)
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
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
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
                        ✓ Active {userProfile?.subscription_tier?.toUpperCase()}{" "}
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
        </div>
      </main>
      <footer className="py-20 border-t border-white/5 bg-black mt-20">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <h2 className="text-3xl font-display font-bold tracking-tighter">
              3LIXIR
            </h2>
            <div className="text-sm text-muted-foreground">
              © 2024 3LIXIR Audio. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-wider"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-wider"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-wider"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
