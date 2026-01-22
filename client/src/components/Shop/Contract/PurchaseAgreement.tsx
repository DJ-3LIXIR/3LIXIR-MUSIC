import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PurchaseAgreement() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-20">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <button
            onClick={() => setLocation("/shop")}
            className="flex items-center gap-2 text-[hsl(var(--gold))] hover:text-[hsl(var(--gold))]/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </button>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4 text-[hsl(var(--gold))]">
              3LIXIR MUSIC Purchasing & Usage Agreement
            </h1>
            <p className="text-muted-foreground mb-8">
              Last Updated: January 2026
            </p>

            <div className="space-y-6 text-muted-foreground">
              <p>
                This Purchasing & Usage Agreement ("Agreement") is a legally
                binding contract between 3LIXIR MUSIC, operated by DJ 3LIXIR
                ("we," "us," "Licensor"), and the individual purchasing,
                subscribing to, or otherwise acquiring access to a Beat,
                license, Subscription, Token, or Black Card License ("you,"
                "Purchaser," "Licensee").
              </p>
              <p>
                By completing a purchase, activating a Subscription, applying a
                Token, or downloading any Beat, you acknowledge that you have
                read, understood, and agreed to this Agreement, the Terms of
                Service, and the Beat License Agreement.
              </p>

              <div className="space-y-8 mt-8">
                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    1. What You Are Paying For
                  </h2>
                  <p className="mb-3">
                    When you purchase from 3LIXIR MUSIC, you are not buying
                    ownership of a Beat.
                  </p>
                  <p className="mb-3">You are paying for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access to professionally produced Beats</li>
                    <li>Digital delivery and platform services</li>
                    <li>
                      A limited license to use a Beat only as part of a
                      Derivative Work
                    </li>
                    <li>
                      Royalty clearance only if and when conditions are met, as
                      described below
                    </li>
                  </ul>
                  <p className="mt-3 mb-2">No purchase constitutes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>A sale of copyright</li>
                    <li>A transfer of master ownership</li>
                    <li>A publishing share</li>
                    <li>A partnership or joint venture</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    2. Derivative Works Only (Strict Rule)
                  </h2>
                  <p className="mb-3 font-semibold text-white">
                    Only Derivative Works are permitted.
                  </p>
                  <p className="mb-3">You may only use a Beat when it is:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Combined with original vocals, lyrics, or performances
                    </li>
                    <li>Transformed into a new musical work</li>
                  </ul>
                  <p className="mt-3 mb-2">You may not:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Upload, distribute, or monetize the Beat by itself</li>
                    <li>Share the Beat in isolation</li>
                    <li>
                      Repackage the Beat as stock audio, a sample pack, or
                      competing product
                    </li>
                  </ul>
                  <p className="mt-3 italic">
                    Any use of a Beat outside of a Derivative Work is a material
                    breach of this Agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    3. Your Responsibility for Recording, Earnings, and Payouts
                  </h2>
                  <p className="mb-3">You are fully responsible for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Recording and producing your Derivative Work</li>
                    <li>Choosing your distributor and platforms</li>
                    <li>Uploading and managing your releases</li>
                    <li>Accurately reporting earnings where required</li>
                    <li>
                      Paying collaborators, artists, or contributors you work
                      with
                    </li>
                  </ul>
                  <p className="mt-3 italic">
                    3LIXIR MUSIC does not collect, hold, or distribute your
                    artist earnings unless explicitly agreed to in writing.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    4. Rights Tracking, PROs, and Distribution
                  </h2>
                  <p className="mb-3">
                    To protect rights and ensure proper tracking:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>3LIXIR MUSIC works with Symphonic Distribution</li>
                    <li>
                      Publishing and performance income may be tracked through
                      ASCAP and/or BMI
                    </li>
                    <li>
                      Content ID systems are actively used to protect Beats and
                      Derivative Works
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/30 rounded-lg">
                    <p className="font-semibold text-[hsl(var(--gold))]">
                      👉 You must contact 3LIXIR MUSIC before uploading any
                      Derivative Work so rights can be properly cleared and
                      conflicts avoided.
                    </p>
                  </div>
                  <p className="mt-3 mb-2">
                    Failure to notify us before upload may result in:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Content ID claims</li>
                    <li>Monetization holds</li>
                    <li>Takedowns</li>
                    <li>Delayed releases</li>
                  </ul>
                  <p className="mt-3 italic">
                    These are not grounds for refunds.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    5. Content ID and Upload Clearance
                  </h2>
                  <p className="mb-3">
                    All Beats may be registered or protected through Content ID
                    or similar systems.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      You may not upload a Derivative Work without clearance
                    </li>
                    <li>
                      You may not dispute Content ID claims unless instructed by
                      us
                    </li>
                    <li>Unauthorized uploads may be flagged automatically</li>
                  </ul>
                  <p className="mt-3 font-semibold text-white">
                    Clearance is required before release, not after.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    6. Subscription-Based Licensing Rules
                  </h2>
                  <p className="mb-3">
                    If you access or license a Beat through an active
                    Subscription:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      You must publish the Derivative Work while the
                      Subscription is active
                    </li>
                    <li className="mb-2">
                      If you cancel before publishing:
                      <ul className="list-circle list-inside space-y-1 ml-6 mt-2">
                        <li>Royalty clearance is not preserved</li>
                        <li>
                          You must either:
                          <ul className="list-square list-inside space-y-1 ml-6 mt-1">
                            <li>Re-subscribe, or</li>
                            <li>Purchase a Black Card License</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <p className="mt-3 italic">
                    Uploading after cancellation without proper clearance is
                    prohibited.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    7. Black Card License (Unlimited Clearance)
                  </h2>
                  <p className="mb-3">If you purchase a Black Card License:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You may upload the Derivative Work at any time</li>
                    <li>Clearance is indefinite for that Beat</li>
                    <li>No Subscription is required</li>
                    <li>Timing restrictions do not apply</li>
                  </ul>
                  <p className="mt-3 italic">
                    The Black Card License applies only to the specific Beat
                    licensed and does not grant ownership or exclusivity.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    8. Credits
                  </h2>
                  <p className="mb-3">
                    Where commercially reasonable, you agree to credit:
                  </p>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <p className="text-[hsl(var(--gold))] font-semibold">
                      "Produced by 3LIXIR MUSIC"
                    </p>
                  </div>
                  <p className="mt-3 italic">
                    Failure to credit does not void the license but may be
                    considered a breach.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    9. Prohibited Actions
                  </h2>
                  <p className="mb-3">You may not:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Claim ownership of any Beat</li>
                    <li>
                      Register Beats or Derivative Works in Content ID without
                      permission
                    </li>
                    <li>Use DMCA takedowns to resolve licensing disputes</li>
                    <li>Upload Beats without clearance</li>
                    <li>
                      Misrepresent your rights to distributors or platforms
                    </li>
                  </ul>
                  <p className="mt-3 mb-2">Violations may result in:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>License termination</li>
                    <li>Takedowns</li>
                    <li>Loss of clearance</li>
                    <li>Account termination</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    10. Relationship to Other Agreements
                  </h2>
                  <p className="mb-3">This Agreement works together with:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Terms of Service</li>
                    <li>Beat License Agreement</li>
                    <li>Refund & Cancellation Policy</li>
                    <li>DMCA Policy</li>
                  </ul>
                  <p className="mt-3 italic">
                    If there is a conflict, the Beat License Agreement and Terms
                    of Service control.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    11. No Guarantees
                  </h2>
                  <p className="mb-3">We do not guarantee:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Streams</li>
                    <li>Sales</li>
                    <li>Chart placement</li>
                    <li>Income</li>
                    <li>Distribution acceptance</li>
                  </ul>
                  <p className="mt-3 italic">
                    Success depends on your execution, marketing, and audience.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    12. Governing Law
                  </h2>
                  <p>
                    This Agreement is governed by the laws of the State of
                    California, without regard to conflict-of-law principles.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-semibold tracking-tight mb-3 text-white">
                    13. Acceptance
                  </h2>
                  <p className="mb-3">
                    By purchasing, subscribing, downloading, or using any Beat
                    or Service from 3LIXIR MUSIC, you confirm that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You understand what you are paying for</li>
                    <li>You understand how you may and may not use the Beat</li>
                    <li>You accept full responsibility for your releases</li>
                  </ul>
                </section>

                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                  <p className="font-semibold text-white">
                    END OF PURCHASING & USAGE AGREEMENT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          © 2026 3LIXIR MUSIC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
