import { Beat } from "@/lib/data";
import { Play, Pause, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

interface BeatCardProps {
  beat: Beat;
}

export function BeatCard({ beat }: BeatCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Extract YouTube video ID from URL
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
      {/* Cover Image Area */}
      <div className="aspect-square relative overflow-hidden">
        {isPlaying && youtubeId ? (
          // YouTube Embed
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1`}
            title={beat.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <>
            {/* Cover Image */}
            <img
              src={beat.cover}
              alt={beat.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isHovered || isPlaying ? "opacity-100" : "opacity-0"}`}
            >
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-1" />
                )}
              </button>
            </div>

            {/* Top Right Actions */}
            <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-[hsl(var(--gold))] transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Close button when video is playing */}
        {isPlaying && youtubeId && (
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/80 backdrop-blur-md text-white hover:bg-black transition-colors flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      {/* Content */}
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
            className="rounded-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))/90] font-bold text-xs uppercase px-4"
          >
            <ShoppingCart className="w-3 h-3 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
