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

// Type for Subscription
export interface Subscription {
  id: string;
  user_id: string;
  subscription_id: string;
  plan_id: string;
  plan_name: string;
  status: string;
  start_date: string;
  next_billing_date: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

interface ManageSubscriptionProps {
  subscription: Subscription | null;
  loading: boolean;
  onRefresh: () => Promise<void>;
  userId: string;
  userEmail: string;
}

export default function ManageSubscription({
  subscription,
  loading,
  onRefresh,
  userId,
  userEmail,
}: ManageSubscriptionProps) {
  const [, setLocation] = useLocation();
  const [canceling, setCanceling] = useState(false);
  const [reactivating, setReactivating] = useState(false);

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

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    const confirmed = confirm(
      "Are you sure you want to cancel your subscription? You'll keep access until " +
        new Date(subscription.next_billing_date!).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }) +
        ". Please note: All sales are final and no refunds will be issued.",
    );

    if (!confirmed) return;

    setCanceling(true);

    try {
      const response = await fetch(
        "https://tciugratutxxrdtbsxim.supabase.co/functions/v1/cancel-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaXVncmF0dXR4eHJkdGJzeGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NzYwMDgsImV4cCI6MjA4MzA1MjAwOH0.-yif_fwvYOwE6kG4nkSc1HXyF-cHTlZGWGJ91YXsPuM",
          },
          body: JSON.stringify({
            userId,
            subscriptionId: subscription.subscription_id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      alert(data.message);
      await onRefresh();
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setCanceling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription) return;

    setReactivating(true);

    try {
      const response = await fetch(
        "https://tciugratutxxrdtbsxim.supabase.co/functions/v1/reactivate-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaXVncmF0dXR4eHJkdGJzeGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NzYwMDgsImV4cCI6MjA4MzA1MjAwOH0.-yif_fwvYOwE6kG4nkSc1HXyF-cHTlZGWGJ91YXsPuM",
          },
          body: JSON.stringify({
            userId,
            subscriptionId: subscription.subscription_id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reactivate subscription");
      }

      alert(data.message);
      await onRefresh();
    } catch (error: any) {
      console.error("Error reactivating subscription:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setReactivating(false);
    }
  };

  const getStatusBadge = () => {
    if (!subscription) return null;

    if (subscription.cancel_at_period_end) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-full">
          <AlertCircle className="w-4 h-4" />
          <span className="font-medium">Canceling</span>
        </div>
      );
    }

    switch (subscription.status) {
      case "active":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Active</span>
          </div>
        );
      case "past_due":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full">
            <XCircle className="w-4 h-4" />
            <span className="font-medium">Payment Failed</span>
          </div>
        );
      case "canceled":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/10 text-gray-400 rounded-full">
            <XCircle className="w-4 h-4" />
            <span className="font-medium">Canceled</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full">
            <span className="font-medium capitalize">
              {subscription.status}
            </span>
          </div>
        );
    }
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
  if (!subscription) {
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

  // Active subscription view
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* License Card */}
      <div className="relative w-full max-w-md aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl bg-zinc-900">
        <img
          src={licenseCards[subscription.plan_id as keyof typeof licenseCards]}
          alt={tierNames[subscription.plan_id as keyof typeof tierNames]}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Plan Info */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          {tierNames[subscription.plan_id as keyof typeof tierNames]}
        </h1>
        <p className="text-2xl text-[hsl(var(--gold))] font-bold mb-4">
          {tierPrices[subscription.plan_id as keyof typeof tierPrices]}/month
        </p>
        {getStatusBadge()}
      </div>

      {/* Subscription Details */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Next Billing / Cancellation Info */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-[hsl(var(--gold))] flex-shrink-0 mt-1" />
            <div className="flex-grow">
              {subscription.cancel_at_period_end ? (
                <>
                  <h3 className="font-bold text-lg mb-1">Access Until</h3>
                  <p className="text-muted-foreground">
                    {subscription.next_billing_date
                      ? new Date(
                          subscription.next_billing_date,
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <p className="text-sm text-yellow-500 mt-2">
                    Your subscription will not renew. You'll keep access until
                    the end of your billing period.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg mb-1">Next Billing Date</h3>
                  <p className="text-muted-foreground">
                    {subscription.next_billing_date
                      ? new Date(
                          subscription.next_billing_date,
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your subscription will automatically renew on this date.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Subscription Start Date */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Member Since</h3>
              <p className="text-muted-foreground">
                {new Date(subscription.start_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
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
                Managed through Stripe
              </p>
              <a
                href={`https://billing.stripe.com/p/login/test_6oE6qL1wPbwk5Zm288`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[hsl(var(--gold))] hover:underline text-sm"
              >
                Update payment method →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center w-full max-w-2xl">
        {subscription.cancel_at_period_end ? (
          <Button
            onClick={handleReactivateSubscription}
            disabled={reactivating}
            className="bg-green-600 text-white hover:bg-green-700 rounded-full px-8 py-6 text-lg font-bold uppercase tracking-wider"
          >
            {reactivating ? "Reactivating..." : "Reactivate Subscription"}
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setLocation("/licenses")}
              className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-6 text-lg font-bold uppercase tracking-wider"
            >
              Change Plan
            </Button>
            <Button
              onClick={handleCancelSubscription}
              disabled={canceling}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10 rounded-full px-8 py-6 text-lg font-bold uppercase tracking-wider"
            >
              {canceling ? "Canceling..." : "Cancel Subscription"}
            </Button>
          </>
        )}
      </div>

      {/* Important Notice */}
      <div className="w-full max-w-2xl p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <p className="text-sm text-yellow-500 text-center">
          <strong>Note:</strong> All sales are final. If you cancel, you'll keep
          access until{" "}
          {subscription.next_billing_date
            ? new Date(subscription.next_billing_date).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                },
              )
            : "the end of your billing period"}
          , but no refunds will be issued.
        </p>
      </div>
    </div>
  );
}
