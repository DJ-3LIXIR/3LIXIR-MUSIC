import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { ArrowLeft, Sparkles, Check } from "lucide-react";

export default function SubscriptionDesign() {
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [artistName, setArtistName] = useState("");
  const [saving, setSaving] = useState(false);

  // Get subscription tier from URL params
  const params = new URLSearchParams(window.location.search);
  const tier = params.get("tier") || "gold";

  // Determine which card image and details based on tier
  const getSubscriptionDetails = () => {
    switch (tier.toLowerCase()) {
      case "gold":
        return {
          cardImage: "/Screenshot 2026-01-30 at 14.45.05.png",
          tierName: "Gold",
          price: 10,
          split: "45/55",
          perks: [
            "Skip the $50 licensing fee",
            "45% royalty split",
            "Early access to drops",
            "Exclusive beat drops",
            "Merchandise discounts",
            "Event discounts",
          ],
        };
      case "diamond":
        return {
          cardImage: "/Screenshot 2026-01-30 at 14.46.59.png",
          tierName: "Diamond",
          price: 15,
          split: "50/50",
          perks: [
            "Skip the $50 licensing fee",
            "50% royalty split (equal partnership)",
            "Early access to drops",
            "Exclusive beat drops",
            "Merchandise discounts",
            "Event discounts",
            "10% discount on all beats",
            "Priority email support",
          ],
        };
      case "platinum":
        return {
          cardImage: "/Screenshot 2026-01-30 at 14.45.49.png",
          tierName: "Platinum",
          price: 20,
          split: "55/45",
          perks: [
            "Skip the $50 licensing fee",
            "55% royalty split (you get 55%)",
            "Early access to drops",
            "Exclusive beat drops",
            "Merchandise discounts",
            "Event discounts",
            "20% discount on all beats",
            "Production service discounts",
            "Priority support",
          ],
        };
      default:
        return {
          cardImage: "/Screenshot 2026-01-30 at 14.45.05.png",
          tierName: "Gold",
          price: 10,
          split: "45/55",
          perks: [],
        };
    }
  };

  const subscriptionDetails = getSubscriptionDetails();

  // Save subscription to database via API
  const saveSubscriptionToDatabase = async (orderId?: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not logged in");
      }

      const apiUrl = "/api";

      const response = await fetch(`${apiUrl}/subscriptions/custom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          artistName: artistName.trim(),
          tier: subscriptionDetails.tierName,
          orderId: orderId || null,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to save subscription");
      }

      return result.data;
    } catch (error) {
      console.error("Error saving subscription:", error);
      throw error;
    }
  };

  const handleAddToCart = async () => {
    if (!artistName.trim()) {
      alert("Please enter your artist name");
      return;
    }

    setSaving(true);

    try {
      await saveSubscriptionToDatabase();

      // Add SUBSCRIPTION to cart
      addToCart({
        id: `subscription-${tier.toLowerCase()}`,
        title: `${subscriptionDetails.tierName} License Subscription`,
        artist: artistName.trim(),
        price: subscriptionDetails.price,
        cover: subscriptionDetails.cardImage,
        quantity: 1,
        metadata: {
          artistName: artistName.trim(),
          tier: subscriptionDetails.tierName,
          split: subscriptionDetails.split,
        },
      });

      // Redirect to shop (cart page)
      setLocation("/shop");
    } catch (error) {
      alert("Error adding to cart. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-20">
        {/* Back Button */}
        <button
          onClick={() => setLocation("/licenses")}
          className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--gold))] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Licenses
        </button>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-[hsl(var(--gold))]" />
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter">
                Customize Your Membership
              </h1>
              <Sparkles className="w-8 h-8 text-[hsl(var(--gold))]" />
            </div>
            <p className="text-muted-foreground text-lg">
              Personalize your{" "}
              <span className="text-[hsl(var(--gold))] font-bold">
                {subscriptionDetails.tierName}
              </span>{" "}
              membership card
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Side - Input Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Artist Name *
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Enter your artist name"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-[hsl(var(--gold))] focus:outline-none text-white text-lg"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This name will appear on your membership card
                </p>
              </div>

              {/* Subscription Info */}
              <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                <h3 className="font-bold mb-4 text-[hsl(var(--gold))]">
                  Membership Details
                </h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tier:</span>
                    <span className="font-semibold">
                      {subscriptionDetails.tierName} License
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Royalty Split:
                    </span>
                    <span className="font-semibold">
                      {subscriptionDetails.split}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                    <span>Monthly Price:</span>
                    <span className="text-[hsl(var(--gold))]">
                      ${subscriptionDetails.price}/mo
                    </span>
                  </div>
                </div>

                {/* Perks List */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Membership Benefits
                  </p>
                  {subscriptionDetails.perks.map((perk, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground">
                        {perk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-400 font-semibold">
                  💳 This is a recurring monthly subscription. You can cancel
                  anytime.
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!artistName.trim() || saving}
                className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-6 text-lg font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Processing..." : "Add Subscription to Cart"}
              </Button>
            </div>

            {/* Right Side - Live Preview */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-center">
                Live Preview
              </h3>
              <div className="relative">
                <div className="aspect-[1.586/1] bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative">
                  {/* Card Background Image */}
                  <img
                    src={subscriptionDetails.cardImage}
                    alt={`${subscriptionDetails.tierName} Membership Card`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Text - Artist Name - positioned just above the bottom line */}
                  <div className="absolute bottom-[10%] left-0 right-0 text-center px-4">
                    <p
                      className="text-xl md:text-2xl font-bold tracking-wide"
                      style={{
                        color: "#C0C0C0",
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        fontFamily: "monospace",
                      }}
                    >
                      {artistName.trim() || "YOUR NAME HERE"}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  This is how your membership card will look
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Notice */}
          <div className="mt-12 p-6 border border-white/10 rounded-xl bg-white/5 text-center">
            <p className="text-sm text-muted-foreground">
              By subscribing, you agree to our{" "}
              <a
                href="/shop/contract/terms"
                className="text-[hsl(var(--gold))] hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/shop/contract/beat-license"
                className="text-[hsl(var(--gold))] hover:underline"
              >
                Licensing Agreement
              </a>
              . Subscription auto-renews monthly until cancelled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
