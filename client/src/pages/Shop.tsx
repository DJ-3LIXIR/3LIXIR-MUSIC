import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Trash2, Plus, Minus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";

export default function Shop() {
  const [, setLocation] = useLocation();
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } =
    useCart();
  const { user, openAuthModal } = useAuth();
  const [showPayPal, setShowPayPal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Count beats (non-license items) in cart
  const beatItems = items.filter(
    (item) =>
      item.id !== "royalty-token" && !item.id.startsWith("subscription-"),
  );
  const totalBeats = beatItems.reduce((sum, item) => sum + item.quantity, 0);

  // Check if cart has subscription
  const hasSubscription = items.some((item) =>
    item.id.startsWith("subscription-"),
  );

  // Count royalty tokens in cart
  const royaltyTokens = items.find((item) => item.id === "royalty-token");
  const tokenCount = royaltyTokens ? royaltyTokens.quantity : 0;

  // Check if user has proper licensing
  const hasProperLicensing = hasSubscription || tokenCount >= totalBeats;

  useEffect(() => {
    if (showPayPal && paypalRef.current && window.paypal) {
      // Clear any existing PayPal buttons
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
                      tax_total: {
                        value: tax.toFixed(2),
                        currency_code: "USD",
                      },
                    },
                  },
                  items: items.map((item) => ({
                    name: item.title,
                    description: `By ${item.artist}`,
                    unit_amount: {
                      value: item.price.toFixed(2),
                      currency_code: "USD",
                    },
                    quantity: item.quantity,
                  })),
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log("Payment successful!", order);

            // Save order to database
            try {
              const {
                data: { user },
              } = await supabase.auth.getUser();

              if (user) {
                // Save the order
                const { error } = await supabase.from("orders").insert({
                  user_id: user.id,
                  paypal_order_id: order.id,
                  items: items,
                  subtotal: subtotal,
                  tax: tax,
                  total: total,
                  status: "completed",
                });

                if (error) {
                  console.error("Error saving order:", error);
                }

                // Check if order contains a subscription and update user's tier
                const subscriptionItem = items.find((item) =>
                  item.id.startsWith("subscription-"),
                );

                if (subscriptionItem) {
                  let newTier = "tier_zero";

                  // Map subscription names to tier values
                  if (subscriptionItem.id === "subscription-gold") {
                    newTier = "gold";
                  } else if (subscriptionItem.id === "subscription-diamond") {
                    newTier = "diamond";
                  } else if (subscriptionItem.id === "subscription-platinum") {
                    newTier = "platinum";
                  }

                  // Update user's subscription tier in profiles table
                  const { error: updateError } = await supabase
                    .from("profiles")
                    .update({
                      subscription_tier: newTier,
                      updated_at: new Date().toISOString(),
                    })
                    .eq("id", user.id);

                  if (updateError) {
                    console.error(
                      "Error updating subscription tier:",
                      updateError,
                    );
                  } else {
                    console.log("Subscription tier updated to:", newTier);
                  }
                }
              }
            } catch (error) {
              console.error("Error saving order:", error);
            }

            clearCart();
            setShowPayPal(false);

            // Show success message
            alert("Payment successful! Your purchase has been completed.");

            // Redirect to profile purchases section
            setLocation("/profile?section=purchases");
          },
        })
        .render(paypalRef.current);
    }
  }, [showPayPal, total, items, subtotal, tax, clearCart, setLocation]);

  const handleCheckout = () => {
    if (!user) {
      openAuthModal();
    } else if (totalBeats > 0 && !hasProperLicensing) {
      // Show licensing required modal if user has beats but insufficient licensing
      setShowLicenseModal(true);
    } else {
      setShowPayPal(true);
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

      {/* PayPal Checkout Modal */}
      {showPayPal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowPayPal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>

            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/10 my-3"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-[hsl(var(--gold))]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div ref={paypalRef} className="mb-4"></div>

            <p className="text-xs text-muted-foreground text-center">
              Your payment is secured by PayPal
            </p>
          </div>
        </div>
      )}

      <main className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-12">
            Your Cart
          </h1>
          {items.length === 0 ? (
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
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 p-6 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                  >
                    <div className="w-24 h-24 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
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
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.artist}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
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
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="border border-white/10 rounded-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
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
