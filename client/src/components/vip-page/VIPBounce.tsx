import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Lock, Crown, Sparkles, Music, Star } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function VIPBounce() {
  const [, setLocation] = useLocation();
  const { user, openAuthModal } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Lock Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 rounded-full bg-[hsl(var(--gold))]/10 border-4 border-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-16 h-16 text-[hsl(var(--gold))]" />
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              VIP Members <span className="text-[hsl(var(--gold))]">Only</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              This exclusive area is reserved for our Gold, Diamond, and
              Platinum members.
            </p>
          </div>

          {/* What You're Missing */}
          <div className="border border-white/10 rounded-2xl p-8 md:p-12 bg-white/5 backdrop-blur-sm mb-12">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Crown className="w-6 h-6 text-[hsl(var(--gold))]" />
              <h2 className="text-3xl font-display font-bold">
                Premium Benefits
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4">
                  <Music className="w-8 h-8 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Exclusive Beats</h3>
                <p className="text-sm text-muted-foreground">
                  Access VIP-only beats not available to the public
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Early Access</h3>
                <p className="text-sm text-muted-foreground">
                  Get new releases 7 days before everyone else
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Premium Licenses</h3>
                <p className="text-sm text-muted-foreground">
                  Unlimited downloads with premium licensing included
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!user ? (
              <>
                <button
                  onClick={openAuthModal}
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors uppercase tracking-wider min-w-[200px]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setLocation("/licenses")}
                  className="px-8 py-4 bg-[hsl(var(--gold))] text-black font-bold rounded-full hover:bg-[hsl(var(--gold))]/90 transition-colors uppercase tracking-wider min-w-[200px]"
                >
                  View Subscriptions
                </button>
              </>
            ) : (
              <button
                onClick={() => setLocation("/licenses")}
                className="px-8 py-4 bg-[hsl(var(--gold))] text-black font-bold rounded-full hover:bg-[hsl(var(--gold))]/90 transition-colors uppercase tracking-wider min-w-[200px]"
              >
                View Subscriptions
              </button>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-muted-foreground text-sm">
              Choose from Gold, Diamond, or Platinum memberships to unlock
              exclusive content
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
