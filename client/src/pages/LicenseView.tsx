import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { ArrowLeft, Download, Loader2 } from "lucide-react";

export default function LicenseView() {
  const [, params] = useRoute("/license/:type/:id?");
  const [, setLocation] = useLocation();
  const { user, openAuthModal } = useAuth();

  const [loading, setLoading] = useState(true);
  const [licenseData, setLicenseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const licenseType = params?.type; // 'custom', 'subscription', or 'standard'
  const licenseId = params?.id; // Optional ID for custom licenses

  useEffect(() => {
    if (!user) {
      openAuthModal();
      return;
    }
    loadLicenseData();
  }, [user, licenseType, licenseId]);

  const loadLicenseData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      if (licenseType === "custom") {
        // First try to find a custom license associated with this order
        // This query assumes there is a link between custom_licenses and orders, e.g. via order_id
        let customLicenseData = null;

        if (licenseId) {
          // If we have an ID (which might be an order ID based on shop.tsx), try to find by order_id first
          const { data: byOrder, error: orderError } = await supabase
            .from("custom_licenses")
            .select("*")
            .eq("order_id", licenseId)
            .maybeSingle();

          if (byOrder) {
            customLicenseData = byOrder;
          } else {
            // If not found by order_id, try by license id directly
            const { data: byId, error: idError } = await supabase
              .from("custom_licenses")
              .select("*")
              .eq("id", licenseId)
              .maybeSingle();

            if (byId) customLicenseData = byId;
          }
        }

        // If we found a custom license, use it
        if (customLicenseData) {
          setLicenseData({
            type: "custom",
            songName: customLicenseData.song_name,
            artistName: customLicenseData.artist_name,
            licenseeName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Valued Customer",
            orderId: customLicenseData.order_id,
            status: customLicenseData.status,
            createdAt: customLicenseData.created_at,
          });
        } else {
          // Fallback: If no custom license found for this order, show the subscription card
          console.log("No custom license found, falling back to subscription view");
          
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_tier")
            .eq("id", user.id)
            .single();

          const { data: subLicense } = await supabase
            .from("subscription_licenses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          const userTier = profile?.subscription_tier || "tier_zero";
          
          setLicenseData({
            type: "subscription",
            tier: userTier,
            artistName: subLicense?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Valued Customer",
            licenseeName: subLicense?.name || user.user_metadata?.full_name || "Valued Customer",
            status: "active",
            expiresAt: null,
          });
        }
      } else if (licenseType === "subscription") {
        // Load subscription license
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        // Get subscription license details
        const { data: subLicense, error: subError } = await supabase
          .from("subscription_licenses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        setLicenseData({
          type: "subscription",
          tier: profile.subscription_tier,
          artistName: subLicense?.name || user.user_metadata?.full_name || "Valued Customer",
          licenseeName: subLicense?.name || user.user_metadata?.full_name || "Valued Customer",
          status: subLicense?.status || "active",
          expiresAt: subLicense?.expires_at,
        });
      } else {
        // Standard license (no personalization needed)
        setLicenseData({
          type: "standard",
        });
      }
    } catch (err: any) {
      console.error("Error loading license:", err);
      setError(err.message || "Failed to load license");
    } finally {
      setLoading(false);
    }
  };

  const getLicenseCardImage = () => {
    if (licenseData?.type === "subscription") {
      const tier = licenseData.tier?.toLowerCase();
      switch (tier) {
        case "gold":
          return "/Screenshot 2026-01-30 at 14.45.05.png";
        case "diamond":
          return "/Screenshot 2026-01-30 at 14.46.59.png";
        case "platinum":
          return "/Screenshot 2026-01-30 at 14.45.49.png";
        default:
          return "/personal-black-license.png";
      }
    }
    // For custom licenses, use the black card
    return "/personal-black-license.png";
  };

  // Helper to ensure we don't display a UUID as the artist name
  const displayArtistName = (name: any) => {
    if (!name) return "DJ 3LIXIR";
    // Check if it looks like a UUID
    if (typeof name === 'string' && name.length === 36 && name.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return "DJ 3LIXIR";
    }
    return name;
  };

  const handleDownloadPDF = () => {
    // Trigger browser print dialog
    window.print();
  };

  if (!user) {
    return null; // Auth modal will show
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-6 pt-32">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[hsl(var(--gold))]" />
            <p className="text-muted-foreground">Loading your license...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-6 pt-32">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-red-500">
              Error Loading License
            </h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button
              onClick={() => setLocation("/downloads")}
              className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90"
            >
              Return to Downloads
            </Button>
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
          onClick={() => setLocation("/downloads")}
          className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--gold))] transition-colors mb-8 print:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Downloads
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">
              Your License Certificate
            </h1>
            <p className="text-muted-foreground">
              {licenseData.type === "custom" && "Custom License"}
              {licenseData.type === "subscription" &&
                `${licenseData.tier?.replace("tier_", "").toUpperCase()} Subscription License`}
              {licenseData.type === "standard" && "Standard License"}
            </p>
          </div>

          {/* License Card */}
          {(licenseData.type === "custom" ||
            licenseData.type === "subscription") && (
            <div className="mb-8">
              <div className="aspect-[1.586/1] bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative max-w-2xl mx-auto">
                {/* Card Background Image */}
                <img
                  src={getLicenseCardImage()}
                  alt="License Card"
                  className="w-full h-full object-cover"
                />

                {/* Overlay Text - Beat Title (for custom licenses only) */}
                {licenseData.type === "custom" && (
                  <div className="absolute top-[35%] left-0 right-0 text-center px-4">
                    <p
                      className="text-lg md:text-xl font-bold tracking-wide"
                      style={{
                        color: "#C0C0C0",
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        fontFamily: "monospace",
                      }}
                    >
                      {licenseData.songName}
                    </p>
                  </div>
                )}

                {/* Overlay Text - Licensee Name */}
                <div className="absolute bottom-[10%] left-0 right-0 text-center px-4">
                  <p
                    className="text-xl md:text-2xl font-bold tracking-wide"
                    style={{
                      color: "#C0C0C0",
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                      fontFamily: "monospace",
                    }}
                  >
                    {/* For subscription licenses, use the artistName from data (which we set to user's name) */}
                    {licenseData.type === "subscription" ? licenseData.artistName : licenseData.artistName}
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <div className="text-center mt-6 print:hidden">
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download / Print PDF
                </Button>
              </div>
            </div>
          )}

          {/* License Details */}
          <div className="border border-white/10 rounded-xl p-6 bg-white/5">
            <h3 className="font-bold mb-4 text-[hsl(var(--gold))]">
              License Details
            </h3>
            <div className="space-y-3 text-sm">
              {licenseData.type === "custom" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Type:</span>
                    <span className="font-semibold">Custom License</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Beat:</span>
                    <span className="font-semibold">
                      {licenseData.songName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Licensee Name:</span>
                    <span className="font-semibold">
                      {displayArtistName(licenseData.artistName)}
                    </span>
                  </div>
                  {licenseData.orderId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-semibold">
                        {licenseData.orderId}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold capitalize">
                      {licenseData.status}
                    </span>
                  </div>
                </>
              )}

              {licenseData.type === "subscription" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Type:</span>
                    <span className="font-semibold">Subscription License</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tier:</span>
                    <span className="font-semibold">
                      {licenseData.tier?.replace("tier_", "").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Artist:</span>
                    <span className="font-semibold">
                      {displayArtistName(licenseData.artistName)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold capitalize">
                      {licenseData.status}
                    </span>
                  </div>
                </>
              )}

              {licenseData.type === "standard" && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Standard License - Commercial use permitted with
                    attribution.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* License Agreement Link */}
          <div className="mt-8 text-center print:hidden">
            <a
              href="/info?section=licensing"
              className="text-[hsl(var(--gold))] hover:underline text-sm"
            >
              View Full License Agreement →
            </a>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            background: white;
          }
          .bg-background {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
