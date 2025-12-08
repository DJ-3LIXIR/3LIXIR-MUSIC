import { beats } from "@/lib/data";
import { BeatCard } from "./BeatCard";
import { motion } from "framer-motion";

export function BeatList() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              LATEST <span className="text-[hsl(var(--gold))]">ARRIVALS</span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Fresh from the studio. Meticulously mixed and mastered for industry-standard quality.
            </p>
          </div>
          
          <div className="flex gap-4">
            {['All', 'Trap', 'R&B', 'Drill'].map((filter, i) => (
              <button 
                key={filter}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  i === 0 
                    ? 'bg-white text-black' 
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beats.map((beat, index) => (
            <motion.div
              key={beat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <BeatCard beat={beat} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <button className="text-sm font-bold uppercase tracking-[0.2em] text-white hover:text-[hsl(var(--gold))] transition-colors pb-1 border-b border-white/20 hover:border-[hsl(var(--gold))]">
            View All Beats
          </button>
        </div>
      </div>
    </section>
  );
}
