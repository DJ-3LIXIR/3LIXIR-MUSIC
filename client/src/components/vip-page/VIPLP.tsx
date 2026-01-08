import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Crown, Music, Star, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";

export default function VIPLP() {
  const { user } = useAuth();
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
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

          {/* VIP Content Sections */}
          <div className="space-y-12">
            {/* Exclusive Beats */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-display font-bold">
                  Exclusive Beats
                </h2>
                <Star className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm hover:border-[hsl(var(--gold))]/50 transition-colors cursor-pointer"
                  >
                    <div className="w-full aspect-square bg-gradient-to-br from-[hsl(var(--gold))]/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center">
                      <Music className="w-16 h-16 text-[hsl(var(--gold))]" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      VIP Exclusive Beat {i}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Premium quality • 140 BPM • Hip-Hop
                    </p>
                    <button className="w-full py-2 bg-[hsl(var(--gold))] text-black font-bold rounded-full hover:bg-[hsl(var(--gold))]/90 transition-colors text-sm uppercase tracking-wider">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Early Access */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-display font-bold">
                  Early Access
                </h2>
                <Sparkles className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm hover:border-[hsl(var(--gold))]/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-[hsl(var(--gold))]/20 to-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music className="w-10 h-10 text-[hsl(var(--gold))]" />
                      </div>
                      <div className="flex-grow">
                        <div className="inline-block px-2 py-1 bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))] text-xs font-bold rounded mb-2">
                          NEW
                        </div>
                        <h3 className="font-bold text-lg mb-1">
                          Upcoming Release {i}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Available 7 days early for VIP members
                        </p>
                        <button className="px-4 py-2 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors text-sm uppercase tracking-wider">
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community & Support */}
            {(subscriptionTier === "diamond" ||
              subscriptionTier === "platinum") && (
              <div>
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
        </div>
      </section>
    </div>
  );
}
