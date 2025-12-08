import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroBg from "@assets/generated_images/dark_abstract_luxury_audio_waveform_background.png";

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
        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/20 to-background" />
        <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-transparent via-background/50 to-background" />
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
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-neutral-400 to-neutral-600">
              Production
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-10 font-light leading-relaxed">
            Premium instrumentals for the modern artist. 
            Define your sound with exclusive production from the world's elite sound designers.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105">
              Explore Catalog
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest gap-2 transition-all hover:scale-105">
              <Play className="w-4 h-4 fill-white" />
              Latest Drop
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
