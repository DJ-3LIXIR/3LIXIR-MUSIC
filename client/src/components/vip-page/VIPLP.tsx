import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { useLocation } from "wouter";
import { BeatSelect } from "@/components/store/BeatSelect";

export default function VIPLP() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [subscriptionTier, setSubscriptionTier] = useState("tier_zero");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching subscription:", error);
        } else {
          setSubscriptionTier(data?.subscription_tier || "tier_zero");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    checkSubscription();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-[hsl(var(--gold))] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Redirect non-members
  if (subscriptionTier === "tier_zero") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="w-24 h-24 bg-[hsl(var(--gold))]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-12 h-12 text-[hsl(var(--gold))]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              VIP Members Only
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Upgrade to access exclusive beats, early releases, and VIP perks
            </p>
            <button
              onClick={() => setLocation("/licenses")}
              className="px-8 py-4 bg-[hsl(var(--gold))] text-black font-bold rounded-full hover:bg-[hsl(var(--gold))]/90 transition-colors uppercase tracking-wider"
            >
              View Membership Plans
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/20 rounded-full mb-6">
              <Crown className="w-5 h-5 text-[hsl(var(--gold))]" />
              <span className="text-[hsl(var(--gold))] font-bold text-sm uppercase tracking-wider">
                {subscriptionTier === "gold"
                  ? "Gold"
                  : subscriptionTier === "diamond"
                    ? "Diamond"
                    : subscriptionTier === "platinum"
                      ? "Platinum"
                      : "VIP"}{" "}
                Member
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              Welcome to the{" "}
              <span className="text-[hsl(var(--gold))]">VIP Lounge</span>
            </h1>

            <p className="text-xl text-muted-foreground">
              Exclusive content curated just for you
            </p>
          </div>

          {/* Member Perks */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display font-bold">
                Your Member Perks
              </h2>
              <Sparkles className="w-6 h-6 text-[hsl(var(--gold))]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
                <div className="w-12 h-12 bg-[hsl(var(--gold))]/10 rounded-full flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Exclusive Access</h3>
                <p className="text-sm text-muted-foreground">
                  Access to member-only beats not available to the public
                </p>
              </div>

              <div className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
                <div className="w-12 h-12 bg-[hsl(var(--gold))]/10 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Early Releases</h3>
                <p className="text-sm text-muted-foreground">
                  Get new beats before they're released to everyone else
                </p>
              </div>

              <div className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
                <div className="w-12 h-12 bg-[hsl(var(--gold))]/10 rounded-full flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Hand-picked exclusive beats with premium sound design
                </p>
              </div>
            </div>
          </div>

          {/* Community & Support */}
          {(subscriptionTier === "diamond" ||
            subscriptionTier === "platinum") && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-display font-bold">
                  VIP Community
                </h2>
                <Crown className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>

              <div className="border border-white/10 rounded-xl p-8 bg-white/5 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2">
                      Join Our VIP Discord
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Connect with other VIP members, get feedback on your
                      tracks, and network with producers.
                    </p>
                    <button className="px-6 py-3 bg-[hsl(var(--gold))] text-black font-bold rounded-full hover:bg-[hsl(var(--gold))]/90 transition-colors uppercase tracking-wider">
                      Join Discord
                    </button>
                  </div>
                  <div className="w-32 h-32 bg-gradient-to-br from-[hsl(var(--gold))]/20 to-purple-600/20 rounded-full flex items-center justify-center">
                    <Crown className="w-16 h-16 text-[hsl(var(--gold))]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BeatSelect Component - Replaces the old beat grid */}
      <BeatSelect />
    </div>
  );
}
