import { Navbar } from "@/components/layout/Navbar";
import { Trash2, Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function Shop() {
  const [, setLocation] = useLocation();
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const [showModal, setShowModal] = useState(false);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
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
                Add some beats to get started
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
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
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
                    Proceed to Checkout
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-background border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[hsl(var(--gold))]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">
                Account Required
              </h2>
              <p className="text-muted-foreground">
                Create an account to complete your purchase and access your
                beats instantly.
              </p>
            </div>
            <div className="space-y-3">
              <Button className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-6 text-sm font-bold uppercase tracking-widest">
                Create Account
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5 hover:text-white rounded-full py-6 text-sm font-bold uppercase tracking-widest"
              >
                Sign In
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
              Already have an account? Click "Sign In" above
            </p>
          </div>
        </div>
      )}
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
