import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Download, Music, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { useLocation } from "wouter";
import { beats } from "@/lib/data";

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

export default function Downloads() {
  const { user, openAuthModal } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "completed")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Log orders to debug
        console.log("Fetched orders:", data);

        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleDownload = (beatTitle: string, orderId: string) => {
    // Map beat titles to their R2 download URLs
    const downloadUrls: { [key: string]: string } = {
      ARCADE: "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/ARCADE.zip",
      SUBURBIA:
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/SUBURBIA.zip",
      KINGCRAFT:
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/Kingcraft.zip",
      CHRONOPHOBIA:
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/CHRONOPHOBIA.zip",
      "VIBIN'":
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/VIBIN'.zip",
      INCIDIOUS:
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/Incidious.zip",
      THUNDERSHOCK:
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/Thundershock.zip",
      SHIMMERING:
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/SHIMMERING.zip",
      "SPACE CADET":
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/SPACE%20CADET.zip",
      "THE CROP BUMPER":
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/THE%20CROP%20BUMPER.zip",
      EVOLUTION:
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/EVOLUTION.zip",
      "THE HORYZON":
        "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/THE%20HORYZON%20.zip",
      // Add more beats here as you upload them:
      // "THUNDERSHOCK": "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/THUNDERSHOCK.zip",
      // "EVOLUTION": "https://pub-478e4664fd2d4d5db031087e022e5fd1.r2.dev/EVOLUTION.zip",
    };

    const downloadUrl = downloadUrls[beatTitle];

    if (downloadUrl) {
      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${beatTitle}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(
        `Download link not yet available for ${beatTitle}. Please contact support.`,
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-foreground relative">
        {/* Textured Background */}
        <div className="fixed inset-0 z-0">
          {/* Left Side */}
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
          {/* Right Side - Mirrored */}
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
        {/* Textured Background */}
        <div className="fixed inset-0 z-0">
          {/* Left Side */}
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
          {/* Right Side - Mirrored */}
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

  // Get all unique purchased beats from all orders with null checks
  const allPurchasedBeats = orders.flatMap((order) => {
    if (!order.items || !Array.isArray(order.items)) {
      console.warn("Order has no items array:", order);
      return [];
    }

    return order.items
      .filter((item) => {
        // Check if item exists and has required properties
        if (!item || !item.id) {
          console.warn("Invalid item in order:", item);
          return false;
        }

        // Skip Stripe's price_data format (these are broken orders from before the fix)
        if (item.hasOwnProperty("price_data")) {
          console.warn("Skipping Stripe format item (broken order):", item);
          return false;
        }

        // Filter out tokens and subscriptions
        return (
          item.id !== "royalty-token" && !item.id.startsWith("subscription-")
        );
      })
      .map((item) => {
        // Try to find the beat in our local data to fill in missing gaps
        const localBeat = beats.find(
          (b) => b.id === item.id || b.title === item.title,
        );

        return {
          ...item,
          // Use local data if order data is missing/unknown, or prioritize local data for static assets like cover
          title:
            item.title &&
            item.title !== "Unknown Beat" &&
            item.title !== "Unknown Item"
              ? item.title
              : localBeat?.title || "Unknown Beat",
          artist:
            item.artist && item.artist !== "Unknown Artist"
              ? item.artist
              : localBeat?.artist || "Unknown Artist",
          cover: localBeat?.cover || item.cover, // Always prefer local cover if available as it's more reliable
          price: item.price || 0,
          quantity: item.quantity || 1,
          orderId: order.id,
          orderDate: order.created_at,
        };
      });
  });

  return (
    <div className="min-h-screen bg-black text-foreground relative">
      {/* Textured Background */}
      <div className="fixed inset-0 z-0">
        {/* Left Side */}
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
        {/* Right Side - Mirrored */}
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
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-4">
                Downloads
              </h1>
              <p className="text-xl text-muted-foreground">
                Access all your purchased beats and files
              </p>
            </div>

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
                        Purchased{" "}
                        {new Date(beat.orderDate).toLocaleDateString()}
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
            )}

            {allPurchasedBeats.length > 0 && (
              <div className="mt-12 p-6 border border-white/10 rounded-lg bg-black/80">
                <h3 className="text-lg font-bold mb-2">
                  Download Instructions
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    • All files are high-quality and ready for commercial use
                  </li>
                  <li>
                    • Downloads include MP3/WAV files based on your license
                  </li>
                  <li>• Keep your files backed up in a safe location</li>
                  <li>• Need help? Contact support@3lixirmusic.com</li>
                </ul>
              </div>
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
