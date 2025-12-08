import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { BeatList } from "@/components/store/BeatList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[hsl(var(--gold))] selection:text-black">
      <Navbar />
      <Hero />
      <BeatList />
      
      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <h2 className="text-3xl font-display font-bold tracking-tighter">3LIXR</h2>
            <div className="text-sm text-muted-foreground">
              © 2024 3LIXR Audio. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-wider">Instagram</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-wider">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-wider">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
