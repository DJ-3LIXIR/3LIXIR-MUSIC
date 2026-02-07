import React from "react";
import { Music, Sparkles, Headphones, Zap, CheckCircle } from "lucide-react";

const ProductionOpportunities = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
        Production Opportunities
      </h2>

      <div className="space-y-8">
        {/* Intro Section */}
        <section>
          <p className="text-lg leading-relaxed text-muted-foreground">
            DJ 3LIXIR offers custom production services designed to bring your
            musical vision to life. Whether you need a beat tailored to your
            unique style, full instrumental composition, or collaborative
            production work, we provide hands-on, artist-focused solutions that
            go beyond the catalog.
          </p>
        </section>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Custom Beat Production */}
          <div className="border border-white/10 rounded-xl p-6 bg-gradient-to-br from-[hsl(var(--gold))]/10 to-transparent hover:border-[hsl(var(--gold))]/30 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                <Music className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                  Custom Beat Production
                </h3>
                <p className="text-muted-foreground text-sm">
                  Get a beat made specifically for you. Describe your vision,
                  share references, and receive a professionally produced
                  instrumental crafted to match your artistic direction.
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Tailored to your style and genre
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Unlimited revisions until satisfied
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Full stems and project files included
              </li>
            </ul>
          </div>

          {/* Full Production Services */}
          <div className="border border-white/10 rounded-xl p-6 bg-gradient-to-br from-[hsl(var(--gold))]/10 to-transparent hover:border-[hsl(var(--gold))]/30 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                  Full Production Services
                </h3>
                <p className="text-muted-foreground text-sm">
                  From concept to completion. Comprehensive production including
                  composition, arrangement, mixing, and mastering. Perfect for
                  artists working on albums, EPs, or flagship singles.
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                End-to-end production workflow
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Professional mixing and mastering
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Industry-standard quality output
              </li>
            </ul>
          </div>

          {/* Collaboration & Co-Production */}
          <div className="border border-white/10 rounded-xl p-6 bg-gradient-to-br from-[hsl(var(--gold))]/10 to-transparent hover:border-[hsl(var(--gold))]/30 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                <Headphones className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                  Collaboration & Co-Production
                </h3>
                <p className="text-muted-foreground text-sm">
                  Work side-by-side with DJ 3LIXIR to develop your sound.
                  Collaborative sessions where your ideas meet professional
                  execution, perfect for artists who want creative input
                  throughout the process.
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Real-time creative collaboration
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Flexible workflow to match your process
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Shared creative ownership options
              </li>
            </ul>
          </div>

          {/* Remix & Rework Services */}
          <div className="border border-white/10 rounded-xl p-6 bg-gradient-to-br from-[hsl(var(--gold))]/10 to-transparent hover:border-[hsl(var(--gold))]/30 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                <Zap className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                  Remix & Rework Services
                </h3>
                <p className="text-muted-foreground text-sm">
                  Breathe new life into existing tracks. Transform your music
                  with fresh production, updated arrangements, or complete genre
                  reimagining while maintaining the core essence of your work.
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Genre transformation and crossover
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Modernization of older tracks
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                Alternative versions for releases
              </li>
            </ul>
          </div>
        </div>

        {/* Process Section */}
        <section className="mt-12">
          <h3 className="text-2xl font-display font-semibold tracking-tight mb-6 text-center">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-[hsl(var(--gold))]">
                  1
                </span>
              </div>
              <h4 className="font-semibold mb-2">Consultation</h4>
              <p className="text-sm text-muted-foreground">
                Discuss your vision, goals, and creative direction
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-[hsl(var(--gold))]">
                  2
                </span>
              </div>
              <h4 className="font-semibold mb-2">Production</h4>
              <p className="text-sm text-muted-foreground">
                DJ 3LIXIR creates your custom track with precision
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-[hsl(var(--gold))]">
                  3
                </span>
              </div>
              <h4 className="font-semibold mb-2">Revision</h4>
              <p className="text-sm text-muted-foreground">
                Refine and adjust until it matches your vision
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-[hsl(var(--gold))]">
                  4
                </span>
              </div>
              <h4 className="font-semibold mb-2">Delivery</h4>
              <p className="text-sm text-muted-foreground">
                Receive your completed track with all files and rights
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="mt-12 border border-white/10 rounded-xl p-8 bg-white/5">
          <h3 className="text-2xl font-display font-semibold tracking-tight mb-4">
            Why Work With DJ 3LIXIR?
          </h3>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              <strong className="text-foreground">
                Multi-Genre Expertise:
              </strong>{" "}
              From EDM to Hip Hop, Lo-Fi to House, experience across diverse
              styles means your sound gets the attention it deserves.
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Artist-First Mindset:</strong>{" "}
              This isn't factory production. Every project is treated as a
              unique creative endeavor with your success as the priority.
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Real Instrumentation:</strong>{" "}
              Live piano and saxophone integration available for authentic,
              organic textures that set your music apart.
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">
                Clear Rights Management:
              </strong>{" "}
              No confusion, no hidden clauses. You know exactly what you own and
              what you can do with it.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-12 bg-gradient-to-r from-[hsl(var(--gold))]/10 to-transparent border border-[hsl(var(--gold))]/20 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
            Ready to Create Something Unique?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you have a clear vision or just a spark of an idea, let's
            talk about how we can bring your music to life. Custom production
            starts with a conversation.
          </p>
          <a
            href="mailto:support@3lixirmusic.com?subject=Custom Production Inquiry"
            className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] text-black px-8 py-3 rounded-full font-semibold hover:bg-[hsl(var(--gold))]/90 transition-colors"
          >
            <Music className="w-5 h-5" />
            Get In Touch
          </a>
        </section>
      </div>
    </div>
  );
};

export default ProductionOpportunities;
