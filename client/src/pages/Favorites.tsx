import { Navbar } from "@/components/layout/Navbar";
import { BeatCard } from "@/components/store/BeatCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { beats } from "@/lib/data";
import { Heart, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Favorites() {
  const { user, openAuthModal } = useAuth();
  const [, setLocation] = useLocation();
  const [favoriteBeats, setFavoriteBeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch favorite beat IDs
      const { data: favorites, error } = await supabase
        .from("favorites")
        .select("beat_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Match with beats from local data
      if (favorites) {
        const favoriteBeatIds = favorites.map((f) => f.beat_id);
        const matchedBeats = beats.filter((beat) =>
          favoriteBeatIds.includes(beat.id),
        );
        setFavoriteBeats(matchedBeats);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  // Not signed in
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-20">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Sign In to View Favorites
              </h2>
              <p className="text-muted-foreground mb-8 text-center max-w-md">
                Create an account to save your favorite beats and access them
                anytime.
              </p>
              <button
                onClick={openAuthModal}
                className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-20">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[hsl(var(--gold))] animate-spin mb-4" />
              <p className="text-muted-foreground">Loading your favorites...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-4">
              YOUR <span className="text-[hsl(var(--gold))]">FAVORITES</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              All your favorited beats in one place. Keep track of the sounds
              you love.
            </p>
          </div>

          {favoriteBeats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-md">
                Start exploring our catalog and click the heart icon on any beat
                to add it to your favorites.
              </p>
              <button
                onClick={() => setLocation("/beats")}
                className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
              >
                Browse Beats
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-muted-foreground text-sm">
                {favoriteBeats.length} favorite
                {favoriteBeats.length !== 1 ? "s" : ""}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteBeats.map((beat, index) => (
                  <motion.div
                    key={beat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <BeatCard beat={beat} />
                  </motion.div>
                ))}
              </div>
            </>
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
              © 2024 3LIXIR Audio. All rights reserved.
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
  );
}
