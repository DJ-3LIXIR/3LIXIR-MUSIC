import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Download, Music, Clock, CheckCircle2, FileText, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { useLocation } from "wouter";
import { beats } from "@/lib/data";

type ViewMode = "beats" | "licenses";

interface OrderItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  quantity: number;
  cover?: string;
}

interface Order {
  id: string;
  created_at: string;
  paypal_order_id: string;
  items: OrderItem[];
  total: number;
  status: string;
}

interface CustomLicense {
  id: string;
  song_name: string;
  artist_name: string;
  order_id: string;
  status: string;
  created_at: string;
}

export default function Downloads() {
  const { user, openAuthModal, userProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>("beats");
  const [orders, setOrders] = useState<Order[]>([]);
  const [customLicenses, setCustomLicenses] = useState<CustomLicense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "completed")
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

        // Fetch custom licenses
        const { data: licensesData, error: licensesError } = await supabase
          .from("custom_licenses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (licensesError) throw licensesError;
        setCustomLicenses(licensesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDownload = (beatTitle: string, orderId: string) => {
    const downloadUrls: { [key: string]: string } = {
      ARCADE: "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/ARCADE.zip",
      SUBURBIA: "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/SUBURBIA.zip",
      KINGCRAFT: "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/Kingcraft.zip",
      CHRONOPHOBIA: "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/CHRONOPHOBIA.zip",
      "VIBIN'": "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/VIBIN'.zip",
      INCIDIOUS: "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/Incidious.zip",
      THUNDERSHOCK: "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/Thundershock.zip",
      SHIMMERING: "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/SHIMMERING.zip",
      "SPACE CADET": "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/SPACE%20CADET.zip",
      "THE CROP BUMPER": "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/THE%20CROP%20BUMPER.zip",
      EVOLUTION: "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/EVOLUTION.zip",
      "THE HORYZON": "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/THE%20HORYZON%20.zip",
    };

    const downloadUrl = downloadUrls[beatTitle];

    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${beatTitle}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Download link not yet available for ${beatTitle}. Please contact support.`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-foreground relative">
        <div className="fixed inset-0 z-0">
          <div
            className="absolute top-0 left-0 bottom-0 w-1/2"
            style={{
              backgroundImage: 'url("/black_gold_brick_texture.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.4,
            }}
          />
          <div
            className="absolute top-0 right-0 bottom-0 w-1/2"
            style={{
              backgroundImage: 'url("/black_gold_brick_texture.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.4,
              transform: "scaleX(-1)",
            }}
          />
        </div>
        <div className="relative z-10">
          <Navbar />
          <main className="pt-20">
            <div className="container mx-auto px-6 py-20">
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <Download className="w-12 h-12 text-[hsl(var(--gold))]" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Sign In Required</h1>
                <p className="text-muted-foreground mb-8 text-center max-w-md">
                  You need to be signed in to access your downloads
                </p>
                <Button
                  onClick={openAuthModal}
                  className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-foreground relative">
        <div className="fixed inset-0 z-0">
          <div
            className="absolute top-0 left-0 bottom-0 w-1/2"
            style={{
              backgroundImage: 'url("/black_gold_brick_texture.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.4,
            }}
          />
          <div
            className="absolute top-0 right-0 bottom-0 w-1/2"
            style={{
              backgroundImage: 'url("/black_gold_brick_texture.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.4,
              transform: "scaleX(-1)",
            }}
          />
        </div>
        <div className="relative z-10">
          <Navbar />
          <main className="pt-20">
            <div className="container mx-auto px-6 py-20">
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[hsl(var(--gold))]"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Get all unique purchased beats
  const allPurchasedBeats = orders.flatMap((order) => {
    if (!order.items || !Array.isArray(order.items)) {
      return [];
    }

    return order.items
      .filter((item) => {
        if (!item || !item.id) return false;
        if (item.hasOwnProperty("price_data")) return false;
        return item.id !== "royalty-token" && !item.id.startsWith("subscription-");
      })
      .map((item) => {
        const localBeat = beats.find(
          (b) => String(b.id) === String(item.id) || b.title === item.title,
        );

        return {
          ...item,
          title:
            item.title && item.title !== "Unknown Beat" && item.title !== "Unknown Item"
              ? item.title
              : localBeat?.title || "Unknown Beat",
          artist:
            item.artist && item.artist !== "Unknown Artist"
              ? item.artist
              : localBeat?.artist || "Unknown Artist",
          cover: localBeat?.cover || item.cover,
          price: item.price || 0,
          quantity: item.quantity || 1,
          orderId: order.id,
          orderDate: order.created_at,
        };
      });
  });

  // Check if user has subscription
  const hasSubscription = userProfile?.subscription_tier && userProfile.subscription_tier !== "tier_zero";

  return (
    <div className="min-h-screen bg-black text-foreground relative">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute top-0 left-0 bottom-0 w-1/2"
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
          }}
        />
        <div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
            transform: "scaleX(-1)",
          }}
        />
      </div>
      <div className="relative z-10">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-4">
                Downloads
              </h1>
              <p className="text-xl text-muted-foreground">
                Access all your purchased beats and licenses
              </p>
            </div>

            {/* Horizontal Navigation */}
            <div className="mb-8 flex gap-4">
              <button
                onClick={() => setViewMode("beats")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
                  viewMode === "beats"
                    ? "bg-[hsl(var(--gold))] text-black"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                }`}
              >
                <Music className="w-4 h-4" />
                Beats ({allPurchasedBeats.length})
              </button>
              <button
                onClick={() => setViewMode("licenses")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
                  viewMode === "licenses"
                    ? "bg-[hsl(var(--gold))] text-black"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                Licenses ({customLicenses.length + (hasSubscription ? 1 : 0)})
              </button>
            </div>

            {/* Beats View */}
            {viewMode === "beats" && (
              <>
                {allPurchasedBeats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
                      <Music className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No purchases yet</h2>
                    <p className="text-muted-foreground mb-8">
                      Purchase some beats to access your downloads
                    </p>
                    <Button
                      onClick={() => setLocation("/beats")}
                      className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest"
                    >
                      Browse Beats
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allPurchasedBeats.map((beat, index) => (
                        <div
                          key={`${beat.orderId}-${beat.id}-${index}`}
                          className="border border-white/10 rounded-lg p-6 bg-black/80 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-[hsl(var(--gold))]/10"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-white/10 rounded-lg flex-shrink-0 overflow-hidden">
                              {beat.cover ? (
                                <img
                                  src={beat.cover}
                                  alt={beat.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Music className="w-8 h-8 text-[hsl(var(--gold))]" />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h3 className="text-lg font-bold mb-1 truncate">
                                {beat.title}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {beat.artist}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                            <Clock className="w-3 h-3" />
                            <span>
                              Purchased {new Date(beat.orderDate).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-green-500 mb-4 bg-green-500/10 px-3 py-2 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Licensed & Ready</span>
                          </div>

                          <Button
                            onClick={() => handleDownload(beat.title, beat.orderId)}
                            className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-3 text-xs font-bold uppercase tracking-widest"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Files
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 p-6 border border-white/10 rounded-lg bg-black/80">
                      <h3 className="text-lg font-bold mb-2">Download Instructions</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• All files are high-quality and ready for commercial use</li>
                        <li>• Downloads include MP3/WAV files based on your license</li>
                        <li>• Keep your files backed up in a safe location</li>
                        <li>• Need help? Contact support@3lixirmusic.com</li>
                      </ul>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Licenses View */}
            {viewMode === "licenses" && (
              <>
                {customLicenses.length === 0 && !hasSubscription ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No licenses yet</h2>
                    <p className="text-muted-foreground mb-8">
                      Purchase beats or get a subscription to access licenses
                    </p>
                    <Button
                      onClick={() => setLocation("/shop")}
                      className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest"
                    >
                      Go to Shop
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Subscription License */}
                    {hasSubscription && (
                      <div className="border border-white/10 rounded-lg p-6 bg-black/80 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-[hsl(var(--gold))]/10">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-[hsl(var(--gold))]/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-[hsl(var(--gold))]" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="text-lg font-bold mb-1">
                              {userProfile.subscription_tier.toUpperCase()} Subscription
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Unlimited License
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-green-500 mb-4 bg-green-500/10 px-3 py-2 rounded-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Active Subscription</span>
                        </div>

                        <Button
                          onClick={() => setLocation("/license/subscription")}
                          className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-3 text-xs font-bold uppercase tracking-widest"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View License
                        </Button>
                      </div>
                    )}

                    {/* Custom Licenses */}
                    {customLicenses.map((license) => (
                      <div
                        key={license.id}
                        className="border border-white/10 rounded-lg p-6 bg-black/80 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-[hsl(var(--gold))]/10"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-[hsl(var(--gold))]" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="text-lg font-bold mb-1 truncate">
                              {license.song_name}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {license.artist_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <Clock className="w-3 h-3" />
                          <span>
                            Issued {new Date(license.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-green-500 mb-4 bg-green-500/10 px-3 py-2 rounded-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="capitalize">{license.status}</span>
                        </div>

                        <Button
                          onClick={() => setLocation(`/license/custom/${license.id}`)}
                          className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-3 text-xs font-bold uppercase tracking-widest"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View License
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <footer className="relative z-50 py-20 border-t border-yellow-500/20 bg-black mt-20">
          <div className="container px-6 mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold tracking-tighter text-white">
                3LIXIR MUSIC
              </h2>
            </div>
            <div className="flex justify-center gap-6 mb-8">
              <a
                href="#"
                className="relative z-10 text-yellow-500/60 hover:text-yellow-500 transition-colors text-sm uppercase tracking-wider cursor-pointer"
              >
                Instagram
              </a>
              <a
                href="#"
                className="relative z-10 text-yellow-500/60 hover:text-yellow-500 transition-colors text-sm uppercase tracking-wider cursor-pointer"
              >
                Twitter
              </a>
              <a
                href="https://www.youtube.com/@DJ3LIXIR"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 text-yellow-500/60 hover:text-yellow-500 transition-colors text-sm uppercase tracking-wider cursor-pointer"
              >
                YouTube
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-yellow-500/60">
              <a
                href="/info?section=terms"
                className="relative z-10 hover:text-yellow-500 transition-colors cursor-pointer"
              >
                Terms of Service
              </a>
              <span>•</span>
              <a
                href="/info?section=privacy"
                className="relative z-10 hover:text-yellow-500 transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="/info?section=licensing"
                className="relative z-10 hover:text-yellow-500 transition-colors cursor-pointer"
              >
                Licensing Agreement
              </a>
              <span>•</span>
              <a
                href="/info?section=refund"
                className="relative z-10 hover:text-yellow-500 transition-colors cursor-pointer"
              >
                Refund Policy
              </a>
              <span>•</span>
              <a
                href="/info?section=copyright"
                className="relative z-10 hover:text-yellow-500 transition-colors cursor-pointer"
              >
                Copyright & DMCA
              </a>
            </div>
            <div className="text-center text-sm text-yellow-500/60 mt-8">
              © 2026 3LIXIR MUSIC. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}