// File: src/components/Info/TechnicalSupport.tsx
import React from "react";
import {
  Download,
  FileQuestion,
  CreditCard,
  Lock,
  AlertCircle,
  HelpCircle,
  Mail,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

export const TechnicalSupport = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6 text-center">
        Technical Support
      </h2>

      <div className="space-y-8">
        {/* Intro Section */}
        <section className="max-w-3xl mx-auto text-center">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Having technical issues? We're here to help. Browse common solutions
            below or contact our support team directly.
          </p>
        </section>

        {/* Common Issues Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Download Issues */}
          <div className="border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                <Download className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                  Download Issues
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Can't download your purchased beats? Try these solutions:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Check your spam/junk folder for the download email
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Try a different browser (Chrome, Firefox, Safari)
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Disable browser extensions or ad blockers temporarily
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Clear your browser cache and cookies
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* File Format Issues */}
          <div className="border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                <FileQuestion className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                  File Format Questions
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Understanding your files and how to use them:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">MP3:</strong> Standard
                      format for all license tiers
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">WAV:</strong> High-quality
                      uncompressed audio (Premium/Exclusive)
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Stems:</strong> Individual
                      instrument tracks for mixing
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Trackouts:</strong> Full
                      separated tracks for maximum control
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Issues */}
          <div className="border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                  Payment & Billing Issues
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Having trouble with payments or seeing charges?
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Verify your PayPal account is active and has funds
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Check for payment confirmation email
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Contact PayPal support for transaction issues
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Allow 24-48 hours for payment processing
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Account Issues */}
          <div className="border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                <Lock className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                  Account Access
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Can't access your account or purchase history?
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Use password reset if you forgot your login
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Check you're using the correct email address
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Clear browser cookies and try again
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    Contact support with your order number
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting Steps */}
        <section className="mt-12 border border-white/10 rounded-xl p-8 bg-white/5">
          <h3 className="text-2xl font-display font-semibold tracking-tight mb-6 text-center">
            General Troubleshooting Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <h4 className="font-semibold mb-2">Clear Cache</h4>
              <p className="text-sm text-muted-foreground">
                Clear your browser cache and cookies, then refresh the page
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <h4 className="font-semibold mb-2">Try Another Browser</h4>
              <p className="text-sm text-muted-foreground">
                Switch to Chrome, Firefox, or Safari if experiencing issues
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
              <h4 className="font-semibold mb-2">Disable Extensions</h4>
              <p className="text-sm text-muted-foreground">
                Temporarily disable ad blockers and browser extensions
              </p>
            </div>
          </div>
        </section>

        {/* What to Include in Support Request */}
        <section className="mt-12 border border-white/10 rounded-xl p-8 bg-gradient-to-br from-[hsl(var(--gold))]/10 to-transparent">
          <h3 className="text-2xl font-display font-semibold tracking-tight mb-4">
            When Contacting Support, Include:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Order Number</p>
                <p className="text-xs text-muted-foreground">
                  Found in your confirmation email
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Email Address Used</p>
                <p className="text-xs text-muted-foreground">
                  The email you used for purchase
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Beat Name/Title</p>
                <p className="text-xs text-muted-foreground">
                  Specific beat you're having issues with
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Detailed Description</p>
                <p className="text-xs text-muted-foreground">
                  What happened and what you expected
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Browser & Device</p>
                <p className="text-xs text-muted-foreground">
                  What you're using to access the site
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Screenshots (if applicable)</p>
                <p className="text-xs text-muted-foreground">
                  Helps us diagnose the issue faster
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="text-center bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-2">Expected Response Time</h3>
          <p className="text-muted-foreground">
            Our support team typically responds within{" "}
            <span className="text-[hsl(var(--gold))] font-semibold">
              24-48 hours
            </span>
            . For urgent issues, please mark your email as "URGENT" in the
            subject line.
          </p>
        </section>

        {/* Contact CTA */}
        <section className="mt-12 bg-gradient-to-r from-[hsl(var(--gold))]/10 to-transparent border border-[hsl(var(--gold))]/20 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
            Still Need Help?
          </h3>
          <p className="text-muted-foreground mb-6">
            Can't find a solution to your issue? Our support team is ready to
            assist you.
          </p>
          <a
            href="mailto:contact@3lixirmusic.com?subject=Technical Support Request"
            className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] text-black px-8 py-3 rounded-full font-semibold hover:bg-[hsl(var(--gold))]/90 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Technical Support
          </a>
        </section>

        {/* FAQ Quick Links */}
        <section className="mt-12">
          <div className="border border-white/10 rounded-xl p-6 bg-white/5">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-[hsl(var(--gold))]" />
              <h3 className="text-xl font-display font-semibold tracking-tight">
                More Questions?
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Check out our comprehensive FAQ section for answers to common
              questions about licensing, usage rights, and more.
            </p>
            <button className="text-[hsl(var(--gold))] hover:text-[hsl(var(--gold))]/80 font-semibold text-sm flex items-center gap-2 transition-colors">
              View FAQ Section
              <span>→</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

// ========================================
// HOW TO USE IN YOUR InfoPage.tsx:
// ========================================

// 1. Add this import at the top of InfoPage.tsx:
// import { TechnicalSupport } from "@/components/Info/TechnicalSupport";

// 2. In your contact content section, replace the inline technical support code with:
/*
contact: (
  <div className="space-y-12">
    {/* Contact Section *\/}
    <div className="space-y-6 max-w-3xl mx-auto">
      ... your existing contact section code ...
    </div>

    {/* Production Opportunities Section *\/}
    <div className="border-t border-white/10 pt-12">
      ... your existing production opportunities code ...
    </div>

    {/* Technical Support Section - NOW IMPORTED *\/}
    <div className="border-t border-white/10 pt-12">
      <TechnicalSupport />
    </div>
  </div>
)
*/