import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ManageSubscriptionProps {
  subscriptionTier: string | null;
  loading: boolean;
  onRefresh: () => Promise<void>;
  userId: string;
  userEmail: string;
  paypalSubscriptionId?: string | null;
  updatedAt?: string | null;
}

export default function ManageSubscription({
  subscriptionTier,
  loading,
  onRefresh,
  userId,
  userEmail,
  paypalSubscriptionId,
  updatedAt,
}: ManageSubscriptionProps) {
  const [, setLocation] = useLocation();

  // Detect if this is a PayPal subscription
  const isPayPalSubscription = !!paypalSubscriptionId;

  // Map plan IDs to their card images
  const licenseCards = {
    gold: "/gold_card.png",
    diamond: "/diamond-license-card.png",
    platinum: "/platinum_card.png",
  };

  const tierNames = {
    gold: "The Gold License",
    diamond: "The Diamond License",
    platinum: "The Platinum License",
  };

  const tierPrices = {
    gold: "$10.00",
    diamond: "$15.00",
    platinum: "$20.00",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <div className="w-16 h-16 border-4 border-[hsl(var(--gold))] border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading subscription...</p>
      </div>
    );
  }

  // No active subscription
  if (!subscriptionTier || subscriptionTier === "black") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <div className="relative w-full max-w-md aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl bg-zinc-900">
          <img
            src="/ChatGPT Image Jan 6, 2026 at 09_05_34 PM.png"
            alt="The Black License"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold text-white">The Black License</h1>

        <div className="max-w-2xl mx-auto mt-6 p-6 bg-white/5 border border-white/10 rounded-xl text-center">
          <p className="text-muted-foreground mb-4">
            This is the default tier. You still need to purchase a license with
            each beat, or you can choose a subscription plan for unlimited
            access and additional benefits.
          </p>
          <Button
            onClick={() => setLocation("/licenses")}
            className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-6 text-lg font-bold uppercase tracking-wider"
          >
            Choose Subscription
          </Button>
        </div>
      </div>
    );
  }

  const tier = subscriptionTier.toLowerCase() as
    | "gold"
    | "diamond"
    | "platinum";

  // Active subscription view
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* License Card */}
      <div className="relative w-full max-w-md aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl bg-zinc-900">
        <img
          src={licenseCards[tier]}
          alt={tierNames[tier]}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Plan Info */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          {tierNames[tier]}
        </h1>
        <p className="text-2xl text-[hsl(var(--gold))] font-bold mb-4">
          {tierPrices[tier]}/month
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Active</span>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Membership Status */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Active Member</h3>
              <p className="text-muted-foreground">
                You have full access to all {tierNames[tier]} benefits and
                features.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-start gap-4">
            <CreditCard className="w-6 h-6 text-[hsl(var(--gold))] flex-shrink-0 mt-1" />
            <div className="flex-grow">
              <h3 className="font-bold text-lg mb-1">Payment Method</h3>
              <p className="text-muted-foreground mb-3">
                Managed through {isPayPalSubscription ? "PayPal" : "Stripe"}
              </p>
              {isPayPalSubscription ? (
                <a
                  href="https://www.paypal.com/myaccount/autopay/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--gold))] hover:underline text-sm"
                >
                  Manage PayPal subscription →
                </a>
              ) : (
                <a
                  href="https://billing.stripe.com/p/login/test_6oE6qL1wPbwk5Zm288"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--gold))] hover:underline text-sm"
                >
                  Update payment method →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center w-full max-w-2xl">
        <Button
          onClick={() => setLocation("/licenses")}
          className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-6 text-lg font-bold uppercase tracking-wider"
        >
          Change Plan
        </Button>
        <Button
          onClick={() => {
            if (
              confirm("Please contact support to cancel your subscription.")
            ) {
              window.location.href = "/profile?section=support";
            }
          }}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500/10 rounded-full px-8 py-6 text-lg font-bold uppercase tracking-wider"
        >
          Cancel Subscription
        </Button>
      </div>

      {/* Important Notice */}
      <div className="w-full max-w-2xl p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <p className="text-sm text-yellow-500 text-center">
          <strong>Note:</strong> To manage billing details or cancel your
          subscription, please contact our support team.
        </p>
      </div>
    </div>
  );
}
