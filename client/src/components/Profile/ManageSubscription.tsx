import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { useLocation } from "wouter";

export default function VIPLicensesimg() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [subscriptionTier, setSubscriptionTier] = useState("tier_zero");
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setSubscriptionTier("tier_zero");
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
          console.error("Error fetching profile:", error);
          setSubscriptionTier("tier_zero");
        } else {
          setSubscriptionTier(data?.subscription_tier || "tier_zero");
        }
      } catch (err) {
        console.error("Error:", err);
        setSubscriptionTier("tier_zero");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [user]);

  const handleCancelSubscription = async () => {
    if (!user) return;

    const confirmed = confirm(
      "Are you sure you want to cancel your subscription? You will lose access to your current tier benefits. Please note: All sales are final and no refunds will be issued.",
    );

    if (!confirmed) return;

    setCanceling(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_tier: "tier_zero",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      alert(
        "Subscription cancelled successfully. You now have the Black License.",
      );
      setSubscriptionTier("tier_zero");
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      alert(`Error cancelling subscription: ${error.message}`);
    } finally {
      setCanceling(false);
    }
  };

  // Map tiers to their card images
  const licenseCards = {
    tier_zero: "/ChatGPT Image Jan 6, 2026 at 09_05_34 PM.png",
    gold: "/gold_card.png",
    diamond: "/diamond-license-card.png",
    platinum: "/platinum_card.png",
  };

  const tierNames = {
    tier_zero: "The Black License",
    gold: "The Gold License",
    diamond: "The Diamond License",
    platinum: "The Platinum License",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-screen">
        <div className="w-16 h-16 border-4 border-[hsl(var(--gold))] border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading your license...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-screen">
      <div className="relative w-full max-w-md aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl bg-zinc-900">
        <img
          src={licenseCards[subscriptionTier as keyof typeof licenseCards]}
          alt={tierNames[subscriptionTier as keyof typeof tierNames]}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(
              "Image failed to load:",
              licenseCards[subscriptionTier as keyof typeof licenseCards],
            );
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <h1 className="text-4xl font-bold text-white">
        {tierNames[subscriptionTier as keyof typeof tierNames]}
      </h1>

      {subscriptionTier === "tier_zero" && (
        <div className="max-w-2xl mx-auto mt-6 p-6 bg-white/5 border border-white/10 rounded-xl text-center">
          <p className="text-muted-foreground mb-4">
            This is the default tier. You still need to purchase a license with
            each beat, or you can choose a subscription plan for unlimited
            access and additional benefits.
          </p>
          <button
            onClick={() => setLocation("/licenses")}
            className="px-8 py-3 bg-[hsl(var(--gold))] text-black font-bold rounded-full hover:bg-[hsl(var(--gold))]/90 transition-colors uppercase tracking-wider text-sm"
          >
            Choose Subscription
          </button>
        </div>
      )}

      {subscriptionTier !== "tier_zero" && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setLocation("/licenses")}
            className="px-6 py-3 bg-[hsl(var(--gold))] text-black font-bold rounded-full hover:bg-[hsl(var(--gold))]/90 transition-colors uppercase tracking-wider text-sm"
          >
            Change Subscription
          </button>
          <button
            onClick={handleCancelSubscription}
            disabled={canceling}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canceling ? "Cancelling..." : "Cancel Subscription"}
          </button>
        </div>
      )}

      {!user && (
        <p className="text-muted-foreground text-sm">
          Sign in to see your personalized license
        </p>
      )}
    </div>
  );
}
