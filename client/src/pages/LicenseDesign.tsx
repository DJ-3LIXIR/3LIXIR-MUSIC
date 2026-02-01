import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function LicenseDesign() {
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [artistName, setArtistName] = useState("");
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get beat info from URL params
  const params = new URLSearchParams(window.location.search);
  const beatName = params.get("beat") || "BEAT";
  const beatPrice = parseFloat(params.get("price") || "0");
  const beatCover = params.get("cover") || "";

  useEffect(() => {
    loadUserSubscription();
  }, [user]);

  const loadUserSubscription = async () => {
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

      if (error) throw error;

      setSubscriptionTier(data?.subscription_tier || null);
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  // Determine which card image and price based on subscription
  const getLicenseDetails = () => {
    switch (subscriptionTier) {
      case "gold":
        return {
          cardImage: "/Screenshot 2026-01-30 at 14.45.05.png",
          tierName: "Gold",
          price: 0,
          split: "45/55",
        };
      case "diamond":
        return {
          cardImage: "/Screenshot 2026-01-30 at 14.46.59.png",
          tierName: "Diamond",
          price: 0,
          split: "50/50",
        };
      case "platinum":
        return {
          cardImage: "/Screenshot 2026-01-30 at 14.45.49.png",
          tierName: "Platinum",
          price: 0,
          split: "55/45",
        };
      default:
        return {
          cardImage: "/Screenshot 2026-01-30 at 14.46.19.png",
          tierName: "Black",
          price: 50,
          split: "40/60",
        };
    }
  };

  const licenseDetails = getLicenseDetails();

  // NEW: Function to save license to database via API
  const saveLicenseToDatabase = async (orderId?: string) => {
    try {
      // Get the auth token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        alert("Not logged in!");
        return null;
      }

      alert("Token retrieved, calling API...");

      // ADD THIS ALERT TO SEE WHAT WE'RE SENDING
      alert(
        `Sending: songName="${beatName}", artistName="${artistName.trim()}"`,
      );

      console.log("Sending request to backend");

      // Use environment variable for API URL, or fallback to relative path
      const apiUrl = "http://localhost:3001/api";

      const response = await fetch(`${apiUrl}/licenses/custom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          songName: beatName,
          artistName: artistName.trim(),
          orderId: orderId || null,
        }),
      });

      console.log(`Response Status: ${response.status} ${response.statusText}`);
      console.log(`Response Headers:`, response.headers);

      // Get response as text first
      const responseText = await response.text();
      console.log(
        `Response Text (first 1000 chars):`,
        responseText.substring(0, 1000),
      );

      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        alert(
          `Failed to parse response as JSON. Response was: ${responseText.substring(0, 200)}`,
        );
        throw new Error(`Invalid JSON response: ${e.message}`);
      }

      console.log("Parsed result:", result);

      if (!result.success) {
        alert(`API Error: ${result.error}`);
        throw new Error(result.error || "Failed to save license");
      }

      alert("✅ License saved successfully!");
      return result.data;
    } catch (error) {
      console.error("Error saving license:", error);
      alert("Error: " + error.message);
      return null;
    }
  };

  const handleAddToCart = async () => {
    if (!artistName.trim()) {
      alert("Please enter your artist name");
      return;
    }

    alert("🔵 Button clicked!");
    setSaving(true);

    try {
      alert("🔵 About to save license to database...");
      await saveLicenseToDatabase();
      alert("🔵 License saved, adding to cart...");

      addToCart({
        id: `license-${beatName}`,
        title: `Personal ${licenseDetails.tierName} License - ${beatName}`,
        artist: artistName.trim(),
        price: licenseDetails.price,
        cover: licenseDetails.cardImage,
        quantity: 1,
        metadata: {
          beatName: beatName,
          artistName: artistName.trim(),
          tier: licenseDetails.tierName,
          split: licenseDetails.split,
        },
      });

      // Redirect to shop (cart page)
      setLocation("/shop");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-6 pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[hsl(var(--gold))] mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-20">
        {/* Back Button */}
        <button
          onClick={() => setLocation("/beats")}
          className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--gold))] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Beats
        </button>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-[hsl(var(--gold))]" />
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter">
                Design Your License
              </h1>
              <Sparkles className="w-8 h-8 text-[hsl(var(--gold))]" />
            </div>
            <p className="text-muted-foreground text-lg">
              Personalize your {licenseDetails.tierName} License for{" "}
              <span className="text-white font-bold">{beatName}</span>
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
                  This name will appear on your license certificate
                </p>
              </div>

              {/* License Info */}
              <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                <h3 className="font-bold mb-4 text-[hsl(var(--gold))]">
                  License Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Type:</span>
                    <span className="font-semibold">
                      {licenseDetails.tierName} License
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Beat:</span>
                    <span className="font-semibold">{beatName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Royalty Split:
                    </span>
                    <span className="font-semibold">
                      {licenseDetails.split}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Fee:</span>
                    <span className="font-semibold text-[hsl(var(--gold))]">
                      {licenseDetails.price === 0
                        ? "FREE"
                        : `$${licenseDetails.price}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/10">
                    <span className="text-muted-foreground">Beat Price:</span>
                    <span className="font-semibold">
                      ${beatPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                    <span>Total:</span>
                    <span className="text-[hsl(var(--gold))]">
                      ${(licenseDetails.price + beatPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {subscriptionTier && (
                <div className="bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/30 rounded-xl p-4">
                  <p className="text-sm text-[hsl(var(--gold))] font-semibold">
                    🎉 Your {licenseDetails.tierName} subscription saves you $50
                    on this license!
                  </p>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={!artistName.trim()}
                className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-6 text-lg font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add License to Cart
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
                    src={licenseDetails.cardImage}
                    alt={`${licenseDetails.tierName} License Card`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Text - Beat Title - centered at middle of chip */}
                  <div className="absolute top-[35%] left-0 right-0 text-center px-4">
                    <p
                      className="text-lg md:text-xl font-bold tracking-wide"
                      style={{
                        color: "#C0C0C0",
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        fontFamily: "monospace",
                      }}
                    >
                      {beatName}
                    </p>
                  </div>

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
                  This is how your license will look when downloaded
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Notice */}
          <div className="mt-12 p-6 border border-white/10 rounded-xl bg-white/5 text-center">
            <p className="text-sm text-muted-foreground">
              By adding this to your cart, you agree to the{" "}
              <a
                href="/shop/contract/beat-license"
                className="text-[hsl(var(--gold))] hover:underline"
              >
                Beat License Agreement
              </a>{" "}
              and{" "}
              <a
                href="/shop/contract/terms"
                className="text-[hsl(var(--gold))] hover:underline"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
