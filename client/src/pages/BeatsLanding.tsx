import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Search, Music, Zap, TrendingUp } from "lucide-react";

export default function BeatsLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTransition = (destination: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setLocation(destination);
    }, 2500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleTransition(
        `/beats/catalog?search=${encodeURIComponent(searchQuery)}`,
      );
    } else {
      handleTransition("/beats/catalog");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Wrapper for zoom/rotate animation */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 ${
          isAnimating ? "animate-zoom-rotate" : ""
        }`}
      >
        {/* Left Side - Far Top */}
        <div
          className={`absolute bottom-[200vh] left-0 h-screen w-1/2 ${
            isAnimating ? "animate-split-left" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Left Side - Top */}
        <div
          className={`absolute bottom-full left-0 h-screen w-1/2 ${
            isAnimating ? "animate-split-left" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Left Side - Middle */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-1/2 ${
            isAnimating ? "animate-split-left" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Left Side - Bottom */}
        <div
          className={`absolute top-full left-0 h-screen w-1/2 ${
            isAnimating ? "animate-split-left" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Left Side - Far Bottom */}
        <div
          className={`absolute top-[200vh] left-0 h-screen w-1/2 ${
            isAnimating ? "animate-split-left" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Left Side - Far Left Extension */}
        <div
          className={`absolute top-0 bottom-0 right-full w-screen ${
            isAnimating ? "animate-split-left" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Right Side - Far Top */}
        <div
          className={`absolute bottom-[200vh] right-0 h-screen w-1/2 ${
            isAnimating ? "animate-split-right" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Right Side - Top */}
        <div
          className={`absolute bottom-full right-0 h-screen w-1/2 ${
            isAnimating ? "animate-split-right" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Right Side - Middle */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-1/2 ${
            isAnimating ? "animate-split-right" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Right Side - Bottom */}
        <div
          className={`absolute top-full right-0 h-screen w-1/2 ${
            isAnimating ? "animate-split-right" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Right Side - Far Bottom */}
        <div
          className={`absolute top-[200vh] right-0 h-screen w-1/2 ${
            isAnimating ? "animate-split-right" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />

        {/* Right Side - Far Right Extension */}
        <div
          className={`absolute top-0 bottom-0 left-full w-screen ${
            isAnimating ? "animate-split-right" : ""
          }`}
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "200% 100%",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: 0.4,
          }}
        />
      </div>

      <style>{`
        @keyframes zoomRotate {
          0% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.5) rotate(-90deg);
          }
          100% {
            transform: scale(1.5) rotate(-90deg);
          }
        }

        @keyframes splitLeft {
          0%, 50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100vw);
          }
        }

        @keyframes splitRight {
          0%, 50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100vw);
          }
        }

        .animate-zoom-rotate {
          animation: zoomRotate 4s ease-in-out forwards;
          transform-origin: center center;
        }

        .animate-split-left {
          animation: splitLeft 4s ease-in-out forwards;
        }

        .animate-split-right {
          animation: splitRight 4s ease-in-out forwards;
        }
      `}</style>

      <div
        className={`relative z-10 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
      >
        <Navbar />

        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">
              Find Your Next{" "}
              <span className="text-[hsl(var(--gold))]">Hit Beat</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Premium instrumentals crafted by DJ 3LIXIR. Search by genre, mood,
              BPM, or vibe.
            </p>

            {/* Search Bar */}
            <div className="mb-16">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for trap, lo-fi, 140 BPM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                  className="w-full pl-16 pr-6 py-6 text-lg bg-white/5 border-2 border-white/10 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(var(--gold))]/50 focus:ring-4 focus:ring-[hsl(var(--gold))]/20 transition-all"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[hsl(var(--gold))] text-black px-8 py-3 rounded-xl font-bold hover:bg-[hsl(var(--gold))]/90 transition-all"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Browse Button */}
            <button
              onClick={() => handleTransition("/beats/catalog")}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              <Music className="w-5 h-5" />
              Browse All Beats
            </button>
          </div>

          {/* Quick Categories */}
          <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <button
              onClick={() => handleTransition("/beats/catalog?genre=Trap")}
              className="group p-8 bg-white/5 border border-white/10 rounded-xl hover:border-[hsl(var(--gold))]/50 hover:bg-white/10 transition-all text-left"
            >
              <Zap className="w-8 h-8 text-[hsl(var(--gold))] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Trap</h3>
              <p className="text-muted-foreground text-sm">
                Hard-hitting 808s and aggressive energy
              </p>
            </button>

            <button
              onClick={() => handleTransition("/beats/catalog?genre=LOFI")}
              className="group p-8 bg-white/5 border border-white/10 rounded-xl hover:border-[hsl(var(--gold))]/50 hover:bg-white/10 transition-all text-left"
            >
              <Music className="w-8 h-8 text-[hsl(var(--gold))] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Lo-Fi</h3>
              <p className="text-muted-foreground text-sm">
                Chill vibes and smooth textures
              </p>
            </button>

            <button
              onClick={() => handleTransition("/beats/catalog?genre=EDM")}
              className="group p-8 bg-white/5 border border-white/10 rounded-xl hover:border-[hsl(var(--gold))]/50 hover:bg-white/10 transition-all text-left"
            >
              <TrendingUp className="w-8 h-8 text-[hsl(var(--gold))] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">EDM</h3>
              <p className="text-muted-foreground text-sm">
                High-energy electronic production
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
