import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Link } from "wouter";
import heroBg from "@assets/Gemini_Generated_Image_jq82p2jq82p2jq82_1767374921463.png";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Abstract Audio Waveform"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent,_black_50%,_black)]" />
      </div>
      <div className="container relative z-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--gold))] mb-6 backdrop-blur-md">
            Premium Sound Architecture
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-bold tracking-tighter mb-6 text-white leading-[0.9]">
            Curated <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-600">
              Production
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-10 font-light leading-relaxed">
            Premium instrumentals and plugins for the modern artist. Define your sound with
            exclusive production from California based DJ 3LIXIR.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/beats">
              <Button
                size="lg"
                className="h-14 px-8 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
              >
                Explore Catalog
              </Button>
            </Link>
            <Link href="/vst">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-full border-[hsl(var(--gold))]/40 bg-[hsl(var(--gold))]/10 hover:bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))] text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
              >
                Explore Plugins
              </Button>
            </Link>
            <Link href="/tools">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-full border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
              >
                Web Tools
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-full border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest gap-2 transition-all hover:scale-105"
              onClick={() => {
                document.getElementById("beatlist")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <Play className="w-4 h-4 fill-white" />
              Latest Drop
            </Button>
          </div>
        </motion.div>
      </div>
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}
