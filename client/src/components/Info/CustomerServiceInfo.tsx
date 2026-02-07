import { MessageSquare, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CustomerServiceInfo() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6 text-center">
        24/7 Customer Service
      </h2>
      <div className="space-y-8">
        <section>
          <h3 className="text-2xl font-display font-semibold tracking-tight mb-3 text-center">
            AI-Powered Support
          </h3>
          <p className="text-muted-foreground mb-6 text-center">
            Get instant answers about beats, licensing, downloads, and more. Our
            AI assistant is available around the clock to help you.
          </p>

          <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-6">
            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Always Available</p>
                  <p className="text-sm text-muted-foreground">
                    24/7 support, no wait times
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Instant Answers</p>
                  <p className="text-sm text-muted-foreground">
                    Get help immediately, any time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Personalized Help</p>
                  <p className="text-sm text-muted-foreground">
                    Assistance tailored to your needs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Multiple Topics</p>
                  <p className="text-sm text-muted-foreground">
                    Beats, licensing, technical support
                  </p>
                </div>
              </div>
            </div>

            {/* What it can help with */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm font-semibold mb-3 text-center">
                Our AI Assistant Can Help With:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                  Beat Selection
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                  Licensing Options
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                  Download Issues
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                  Account Questions
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                  Subscription Plans
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                  Custom Production
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 flex justify-center">
              <Link href="/profile?section=support">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8 font-semibold"
                >
                  Start Chat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
