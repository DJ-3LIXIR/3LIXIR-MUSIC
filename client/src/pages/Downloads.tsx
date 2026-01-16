import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Download, Music, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { useLocation } from "wouter";

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
    // TODO: Implement actual file download
    console.log(`Downloading ${beatTitle} from order ${orderId}`);
    alert(
      "Download functionality coming soon! Files will be available here once uploaded.",
    );
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

  // Get all unique purchased beats from all orders
  const allPurchasedBeats = orders.flatMap((order) =>
    order.items
      .filter(
        (item) =>
          item.id !== "royalty-token" && !item.id.startsWith("subscription-"),
      )
      .map((item) => ({
        ...item,
        orderId: order.id,
        orderDate: order.created_at,
      })),
  );

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

        <footer className="py-20 border-t border-white/5 bg-black mt-20">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <h2 className="text-3xl font-display font-bold tracking-tighter">
                3LIXIR
              </h2>
              <div className="text-sm text-muted-foreground">
                © 2026 3LIXIR MUSIC. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-wider"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-wider"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-wider"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
