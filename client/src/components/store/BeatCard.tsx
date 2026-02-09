import { Beat } from "@/lib/data";
import { Play, Pause, ShoppingCart, Heart, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";

interface BeatCardProps {
  beat: Beat;
}

export function BeatCard({ beat }: BeatCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("tier_zero");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user, openAuthModal } = useAuth();

  // Fetch user's subscription tier
  useEffect(() => {
    async function fetchSubscription() {
      if (!user) {
        setSubscriptionTier("tier_zero");
        return;
      }
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .maybeSingle();

        if (!error && data) {
          setSubscriptionTier(data.subscription_tier || "tier_zero");
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
      }
    }
    fetchSubscription();
  }, [user]);

  // Check if beat is favorited
  useEffect(() => {
    async function checkFavorite() {
      if (!user) {
        setIsFavorited(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("beat_id", beat.id)
          .maybeSingle();

        if (!error && data) {
          setIsFavorited(true);
        } else {
          setIsFavorited(false);
        }
      } catch (err) {
        setIsFavorited(false);
      }
    }
    checkFavorite();
  }, [user, beat.id]);

  // Toggle favorite
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      openAuthModal();
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites.",
      });
      return;
    }

    if (isTogglingFavorite) return;

    setIsTogglingFavorite(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("beat_id", beat.id);

        if (error) throw error;

        setIsFavorited(false);
        toast({
          title: "Removed from favorites",
          description: `${beat.title} has been removed from your favorites.`,
        });
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          beat_id: beat.id,
        });

        if (error) throw error;

        setIsFavorited(true);
        toast({
          title: "Added to favorites",
          description: `${beat.title} has been added to your favorites.`,
        });
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Check if user has access to member-only content
  const hasAccess =
    !beat.memberOnly || (user && subscriptionTier !== "tier_zero");

  const handlePlay = () => {
    if (beat.memberOnly && !hasAccess) {
      toast({
        title: "Members Only",
        description:
          "This beat is exclusive to members. Upgrade your plan to access.",
        variant: "destructive",
      });
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleAddToCart = () => {
    if (beat.memberOnly && !hasAccess) {
      if (!user) {
        openAuthModal();
        toast({
          title: "Sign in required",
          description: "Please sign in to purchase member-only beats.",
        });
      } else {
        toast({
          title: "Members Only",
          description: "Upgrade your membership to purchase this beat.",
          variant: "destructive",
        });
      }
      return;
    }
    addToCart(beat);
    toast({
      title: "Added to cart",
      description: `${beat.title} has been added to your cart.`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = beat.youtubeUrl ? getYouTubeId(beat.youtubeUrl) : null;

  return (
    <motion.div
      className="group relative bg-card/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      <div className="aspect-square relative overflow-hidden">
        {isPlaying && youtubeId && hasAccess ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1`}
            title={beat.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <>
            <img
              src={beat.cover}
              alt={beat.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isHovered || isPlaying ? "opacity-100" : "opacity-0"}`}
            >
              <button
                onClick={handlePlay}
                className={`w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 ${beat.memberOnly && !hasAccess ? "opacity-50" : ""}`}
              >
                {beat.memberOnly && !hasAccess ? (
                  <Lock className="w-6 h-6" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-1" />
                )}
              </button>
            </div>
            {beat.memberOnly && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--gold))] text-black font-bold text-xs uppercase tracking-wider">
                <Crown className="w-3 h-3" />
                <span>Members Only</span>
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-[hsl(var(--gold))] transition-colors disabled:opacity-50"
              >
                <Heart
                  className={`w-4 h-4 ${isFavorited ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" : ""}`}
                />
              </button>
            </div>
          </>
        )}
        {isPlaying && youtubeId && hasAccess && (
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/80 backdrop-blur-md text-white hover:bg-black transition-colors flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-display font-bold text-lg text-white leading-tight mb-1 group-hover:text-[hsl(var(--gold))] transition-colors">
              {beat.title}
            </h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {beat.artist}
            </p>
          </div>
          <div className="text-right">
            <span className="block font-mono text-lg font-bold text-white">
              ${beat.price}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mb-4">
          <span>{beat.bpm} BPM</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{beat.key}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{formatDate(beat.releaseDate)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
          <div className="flex gap-2">
            {beat.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-md bg-white/5 text-[10px] uppercase tracking-wider text-neutral-400 border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className={`rounded-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 font-bold text-xs uppercase px-4 ${beat.memberOnly && !hasAccess ? "opacity-70" : ""}`}
          >
            {beat.memberOnly && !hasAccess ? (
              <>
                <Lock className="w-3 h-3 mr-2" />
                Locked
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 mr-2" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
