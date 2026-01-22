import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function BeatLicense() {
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
              3LIXIR MUSIC Beat License Agreement
            </h1>
            <p className="text-muted-foreground mb-8">
              Last Updated: January 2026
            </p>

            <div className="space-y-6">
              <p className="text-muted-foreground">
                This Beat License Agreement ("Agreement") is a legally binding
                agreement between{" "}
                <strong className="text-foreground">3LIXIR MUSIC</strong>{" "}
                ("Licensor," "we," "us") and the individual or entity purchasing
                or otherwise acquiring a license to a Beat ("Licensee," "you").
                This Agreement governs your use of any Beat obtained through the
                3LIXIR MUSIC platform and is incorporated by reference into the
                3LIXIR MUSIC Terms of Service ("TOS").
              </p>

              <div className="space-y-8">
                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    1. Grant of License
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Subject to full payment of applicable service fees and
                    continued compliance with this Agreement and the Terms of
                    Service, Licensor grants Licensee a{" "}
                    <strong className="text-foreground">
                      non-exclusive, non-transferable, non-sublicensable,
                      limited license
                    </strong>{" "}
                    to use the licensed Beat solely as incorporated into a new
                    musical composition ("Derivative Work").
                  </p>
                  <p className="text-muted-foreground">
                    This Agreement grants a{" "}
                    <strong className="text-foreground">license only</strong>.
                    No sale, assignment, or transfer of ownership is made or
                    implied.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    2. Ownership and Authorship
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Licensor retains{" "}
                    <strong className="text-foreground">
                      100% ownership and control
                    </strong>{" "}
                    of all rights in and to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>The Beat</li>
                    <li>The master recording of the Beat</li>
                    <li>
                      The underlying musical composition embodied in the Beat
                    </li>
                    <li>
                      All copyrights and intellectual property rights therein
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    All Beats owned by Licensor are authored and controlled by
                    DJ 3LIXIR.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Licensee retains ownership only of:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-2">
                    <li>Original lyrics authored by Licensee</li>
                    <li>
                      Original vocal or instrumental performances added by
                      Licensee
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-2">
                    Such ownership is strictly subject to Licensor's retained
                    rights in the Beat.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    3. Service Fees and License Nature
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    All fees paid to Licensor are service fees for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      The production, preparation, and delivery of DJ 3LIXIR
                      Beats
                    </li>
                    <li>Platform access and digital delivery</li>
                    <li>
                      The grant of the limited license described in this
                      Agreement
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    No payment constitutes a sale of any copyright, master,
                    publishing share, or ownership interest.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    4. Permitted Uses
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Unless otherwise agreed in writing, Licensee may:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Record vocals or performances over the Beat</li>
                    <li>Release the Derivative Work on digital platforms</li>
                    <li>
                      Distribute the Derivative Work for sale or streaming
                    </li>
                    <li>Perform the Derivative Work publicly</li>
                    <li>
                      Synchronize the Derivative Work in audiovisual projects
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    All permitted uses remain subject to the royalty and
                    clearance provisions below.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    5. Prohibited Uses
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Licensee may not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      Resell, sublicense, lease, or redistribute the Beat alone
                    </li>
                    <li>
                      Make the Beat available for download, reuse, or extraction
                    </li>
                    <li>Claim authorship or ownership of the Beat</li>
                    <li>
                      Register the Beat or Derivative Work with Content ID,
                      fingerprinting, or automated monetization systems
                      (including YouTube Content ID){" "}
                      <strong className="text-foreground">
                        without prior written consent
                      </strong>
                    </li>
                    <li>
                      Use the Beat in unlawful, defamatory, or infringing works
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    6. Royalty Rights, Subscriptions, and Tokens
                  </h3>

                  <h4 className="text-xl font-medium mb-3 mt-6">
                    6.1 Subscription Royalty Clearance
                  </h4>
                  <p className="text-muted-foreground">
                    If Licensee acquires a Beat while a 3LIXIR MUSIC
                    Subscription is active and in good standing, Licensor grants{" "}
                    <strong className="text-foreground">
                      royalty clearance
                    </strong>{" "}
                    for that Beat only if the Derivative Work is{" "}
                    <strong className="text-foreground">
                      Published during the active Subscription term
                    </strong>
                    .
                  </p>

                  <h4 className="text-xl font-medium mb-3 mt-6">
                    6.2 Token Royalty Clearance
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    If Licensee is not actively subscribed, royalty clearance
                    may be obtained by applying a{" "}
                    <strong className="text-foreground">Royalty Token</strong>{" "}
                    to a specific Beat. Royalty Tokens:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Apply on a per-Beat basis</li>
                    <li>Are non-refundable</li>
                    <li>
                      Grant royalty clearance only for the identified Beat
                    </li>
                  </ul>

                  <h4 className="text-xl font-medium mb-3 mt-6">
                    6.3 Scope of Royalty Rights
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    Royalty clearance:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      Applies only to the licensed Beat and Derivative Work
                    </li>
                    <li>Does not transfer copyright</li>
                    <li>Does not grant exclusivity</li>
                  </ul>

                  <h4 className="text-xl font-medium mb-3 mt-6">
                    6.4 Revenue Splits
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    Copyright ownership and revenue participation are separate
                    concepts. DJ 3LIXIR retains 100% ownership of all Beats
                    unless expressly agreed otherwise in writing.
                  </p>
                  <p className="text-muted-foreground mt-3 mb-2">
                    Revenue splits are determined by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      <strong className="text-foreground">
                        Black License/Royalty Token ($50):
                      </strong>{" "}
                      40% User / 60% 3LIXIR
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Gold Subscription ($10/month):
                      </strong>{" "}
                      45% User / 55% 3LIXIR
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Diamond Subscription ($15/month):
                      </strong>{" "}
                      50% User / 50% 3LIXIR
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Platinum Subscription ($20/month):
                      </strong>{" "}
                      55% User / 45% 3LIXIR
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-3">
                    Licensees must accurately report, allocate, and honor all
                    applicable splits. Failure to comply constitutes a material
                    breach.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    7. Publication Requirement
                  </h3>
                  <p className="text-muted-foreground">
                    If a Beat is licensed during a Subscription but not
                    Published before Subscription cancellation or expiration,
                    royalty clearance is not preserved, and additional clearance
                    (Royalty Token or re-subscription) is required prior to
                    Publication.
                  </p>
                  <p className="text-muted-foreground mt-3">
                    Publication without valid clearance constitutes a material
                    breach.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    8. Credit
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Where commercially reasonable, Licensee agrees to credit:
                  </p>
                  <blockquote className="border-l-4 border-[hsl(var(--gold))] pl-4 italic text-muted-foreground mb-4">
                    "Produced by DJ 3LIXIR / 3LIXIR MUSIC"
                  </blockquote>
                  <p className="text-muted-foreground">
                    Failure to credit does not void the license but may
                    constitute a breach.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    9. Exclusivity
                  </h3>
                  <p className="text-muted-foreground">
                    All licenses are{" "}
                    <strong className="text-foreground">non-exclusive</strong>{" "}
                    unless expressly granted in a separate written agreement
                    signed by Licensor.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    10. Warranties and Disclaimers
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Licensee represents that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      The Derivative Work will not infringe third-party rights
                    </li>
                    <li>Licensee has authority to enter this Agreement</li>
                    <li>All applicable laws will be followed</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Licensor disclaims all warranties regarding commercial
                    success or fitness for a particular purpose.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    11. Enforcement and Termination
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Licensor may terminate this Agreement upon material breach,
                    including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Violation of these Terms</li>
                    <li>License breaches</li>
                    <li>Non-payment</li>
                    <li>Fraud or abuse</li>
                  </ul>
                  <p className="text-muted-foreground mt-4 mb-2">
                    Upon termination:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>All licensed rights immediately revert to Licensor</li>
                    <li>
                      Continued exploitation must cease unless otherwise
                      authorized
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    12. Limitation of Liability
                  </h3>
                  <p className="text-muted-foreground">
                    Licensor's total liability shall not exceed the service fees
                    paid by Licensee for the applicable Beat.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    13. Indemnification
                  </h3>
                  <p className="text-muted-foreground">
                    Licensee agrees to indemnify and hold harmless Licensor from
                    claims arising from Licensee's use of the Beat or breach of
                    this Agreement.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    14. Governing Law
                  </h3>
                  <p className="text-muted-foreground">
                    This Agreement is governed by the laws of the State of
                    California and subject to the dispute resolution provisions
                    in the Terms of Service.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    15. Entire Agreement
                  </h3>
                  <p className="text-muted-foreground">
                    This Agreement, together with the Terms of Service,
                    constitutes the entire agreement regarding Beat licensing.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    16. Contact
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Questions or legal notices may be directed to:
                  </p>
                  <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-2">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">
                        3LIXIR MUSIC – Attn: Legal
                      </strong>
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Email:</strong>{" "}
                      <span className="text-[hsl(var(--gold))]">
                        support@3lixirmusic.com
                      </span>
                    </p>
                  </div>
                </section>

                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                  <p className="text-muted-foreground font-semibold">
                    END OF LICENSE AGREEMENT
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
