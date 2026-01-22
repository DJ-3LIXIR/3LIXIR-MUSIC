import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Terms() {
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
              3LIXIR MUSIC – Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8">
              Last Updated: January 2026
            </p>

            <div className="space-y-6">
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") govern your access to and use
                of the 3LIXIR MUSIC website, platform, digital downloads,
                subscriptions, licensing services, and related offerings
                (collectively, the "Services"). By accessing or using the
                Services, you agree to be bound by these Terms.
              </p>

              <div className="space-y-8">
                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    1. Acceptance of Terms
                  </h3>
                  <p className="text-muted-foreground">
                    By accessing, browsing, purchasing Beats, subscribing to any
                    plan, downloading content, or otherwise using the Services,
                    you acknowledge that you have read, understood, and agree to
                    be bound by these Terms.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    If you do not agree, you must not use the Services.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    3LIXIR MUSIC may update these Terms at any time. Continued
                    use of the Services after changes are posted constitutes
                    acceptance of the revised Terms.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    2. Definitions
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    For purposes of these Terms:
                  </p>
                  <ul className="space-y-2 text-muted-foreground ml-4">
                    <li>
                      <strong className="text-foreground">
                        "3LIXIR MUSIC"
                      </strong>{" "}
                      means the business name and brand operated by Jared
                      Frazier, an individual, and any future affiliated entity.
                    </li>
                    <li>
                      <strong className="text-foreground">"Platform"</strong>{" "}
                      means the 3LIXIR MUSIC website, storefront, user
                      dashboards, subscription systems, and digital delivery
                      infrastructure.
                    </li>
                    <li>
                      <strong className="text-foreground">"User"</strong> means
                      any individual or entity accessing or using the Services.
                    </li>
                    <li>
                      <strong className="text-foreground">"Beat(s)"</strong>{" "}
                      means musical compositions, instrumentals, or audio works
                      made available through the Platform.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        "DJ 3LIXIR Beat(s)"
                      </strong>{" "}
                      means Beats produced by DJ 3LIXIR.
                    </li>
                    <li>
                      <strong className="text-foreground">"License"</strong>{" "}
                      means a limited, non-exclusive, non-transferable,
                      non-sublicensable right to use a Beat as expressly granted
                      under these Terms and the applicable License Agreement.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        "Royalty Token"
                      </strong>{" "}
                      or{" "}
                      <strong className="text-foreground">
                        "Black License"
                      </strong>{" "}
                      means a per-Beat paid license priced at $50 USD, granting
                      royalty usage rights under a 40% (User) / 60% (3LIXIR)
                      royalty split.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        "Subscription"
                      </strong>{" "}
                      means a recurring monthly plan that allows Users to
                      license Beats without paying the $50 Royalty Token fee,
                      subject to the royalty splits of the selected tier.
                    </li>
                    <li>
                      <strong className="text-foreground">"Published"</strong>{" "}
                      means publicly released or distributed to the public via
                      streaming platforms, digital stores, video platforms,
                      broadcast, or other public-facing channels.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        "Royalty Rights"
                      </strong>{" "}
                      means the contractual right to commercially exploit a Beat
                      and collect royalties according to the applicable royalty
                      split, subject to compliance with these Terms.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    3. Eligibility and Accounts
                  </h3>
                  <p className="text-muted-foreground">
                    You must be at least eighteen (18) years old to use the
                    Services.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    You are responsible for maintaining the security of your
                    account and all activity conducted through it.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    4. Description of Services
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    3LIXIR MUSIC provides digital music licensing services,
                    including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Licensing of DJ 3LIXIR Beats</li>
                    <li>Per-Beat Royalty Token licensing</li>
                    <li>Subscription-based licensing plans</li>
                    <li>Royalty split enforcement and monitoring</li>
                    <li>Music production–related digital services</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    3LIXIR MUSIC may modify, suspend, or discontinue any aspect
                    of the Services at any time.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    5. Licensing Options & Pricing
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-2">
                        A. Pay-Per-Song License (Black License)
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                        <li>Price: $50 USD per Beat</li>
                        <li>Royalty Split: User: 40% / 3LIXIR: 60%</li>
                        <li>License is granted on a per-Beat basis</li>
                        <li>No subscription required</li>
                        <li>
                          Royalty Rights are retained for the life of the song,
                          provided the Beat was properly licensed and Published
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-2">
                        B. Subscription Plans
                      </h4>
                      <p className="text-muted-foreground mb-3">
                        Subscriptions allow Users to license Beats without
                        paying the $50 Royalty Token fee, subject to the
                        following royalty splits:
                      </p>
                      <div className="border border-white/10 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-white/5">
                            <tr>
                              <th className="px-4 py-3 text-left text-foreground">
                                Plan
                              </th>
                              <th className="px-4 py-3 text-left text-foreground">
                                Monthly Price
                              </th>
                              <th className="px-4 py-3 text-left text-foreground">
                                Royalty Split
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-muted-foreground">
                            <tr className="border-t border-white/10">
                              <td className="px-4 py-3">Gold</td>
                              <td className="px-4 py-3">$10</td>
                              <td className="px-4 py-3">
                                45% User / 55% 3LIXIR
                              </td>
                            </tr>
                            <tr className="border-t border-white/10">
                              <td className="px-4 py-3">Diamond</td>
                              <td className="px-4 py-3">$15</td>
                              <td className="px-4 py-3">
                                50% User / 50% 3LIXIR
                              </td>
                            </tr>
                            <tr className="border-t border-white/10">
                              <td className="px-4 py-3">Platinum</td>
                              <td className="px-4 py-3">$20</td>
                              <td className="px-4 py-3">
                                55% User / 45% 3LIXIR
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-muted-foreground mt-3">
                        Subscription benefits apply only while the subscription
                        is active.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    6. Subscription Cancellation & Post-Cancellation Rights
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    If you cancel your Subscription:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      You retain Royalty Rights for Beats that were:
                      <ul className="list-circle list-inside ml-6 mt-1">
                        <li>Licensed while subscribed and</li>
                        <li>Published while subscribed</li>
                      </ul>
                    </li>
                    <li>Royalty splits for those Beats do not change</li>
                    <li>
                      New Beat licenses after cancellation require payment of
                      the $50 Black License unless you resubscribe
                    </li>
                    <li>
                      Access to subscription-only benefits may terminate
                      immediately
                    </li>
                    <li>
                      Beats downloaded but not Published prior to cancellation
                      are not guaranteed royalty clearance without a Royalty
                      Token
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    7. Ownership & Intellectual Property
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    All Beats remain the exclusive property of their respective
                    copyright owners.
                  </p>
                  <p className="text-muted-foreground mb-2">
                    All DJ 3LIXIR Beats are owned by 3LIXIR MUSIC.
                  </p>
                  <p className="text-muted-foreground mb-2">
                    Licensing a Beat does not transfer ownership of:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Copyright</li>
                    <li>Master recording</li>
                    <li>Publishing</li>
                    <li>Composition</li>
                    <li>Intellectual property</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    8. License Restrictions
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Unless expressly authorized in writing, Users may not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      Resell, sublicense, or redistribute Beats as standalone
                      files
                    </li>
                    <li>Claim authorship or ownership of any Beat</li>
                    <li>
                      Register Beats or derivative works in Content ID,
                      fingerprinting, or monetization systems without written
                      consent
                    </li>
                    <li>
                      Use Beats in a manner that violates the agreed royalty
                      split
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Any use outside the granted License constitutes a material
                    breach and may result in takedowns, termination, and legal
                    action.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    9. Royalty Reporting & Enforcement
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Users are contractually obligated to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Properly credit 3LIXIR as producer/songwriter</li>
                    <li>Accurately report earnings</li>
                    <li>Pay agreed royalty percentages</li>
                  </ul>
                  <p className="text-muted-foreground mt-3 mb-2">
                    Enforcement Methods Include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>YouTube Content ID ownership assignment</li>
                    <li>PRO registrations (ASCAP/BMI)</li>
                    <li>Manual audits and reporting requirements</li>
                    <li>DMCA takedowns for non-compliance</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Failure to comply constitutes a breach of contract.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    10. Payments, Refunds & Chargebacks
                  </h3>
                  <p className="text-muted-foreground">
                    All payments are service fees for production, preparation,
                    delivery, and licensing services.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-2">
                    <li>All sales are final except where required by law</li>
                    <li>Royalty Tokens and Subscriptions are non-refundable</li>
                    <li>
                      Chargebacks may result in account suspension or
                      termination
                    </li>
                    <li>Users are responsible for all applicable taxes</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    11. User Conduct
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    You agree not to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Use the Services unlawfully</li>
                    <li>Infringe intellectual property</li>
                    <li>Misrepresent ownership or royalty rights</li>
                    <li>Attempt to bypass licensing or payment systems</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    12. Third-Party Beats
                  </h3>
                  <p className="text-muted-foreground">
                    Some Beats may be owned by third-party rights holders.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    3LIXIR MUSIC licenses such Beats only to the extent
                    authorized and does not claim ownership.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    13. Disclaimers
                  </h3>
                  <p className="text-muted-foreground">
                    Services are provided "AS IS" and "AS AVAILABLE."
                  </p>
                  <p className="text-muted-foreground mt-2">
                    No guarantees are made regarding uptime, results, or
                    earnings.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    14. Limitation of Liability
                  </h3>
                  <p className="text-muted-foreground">
                    To the maximum extent permitted by law, total liability
                    shall not exceed the amount paid by you to 3LIXIR MUSIC in
                    the twelve (12) months preceding the claim.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    15. Indemnification
                  </h3>
                  <p className="text-muted-foreground">
                    You agree to indemnify and hold harmless 3LIXIR MUSIC from
                    claims arising from your use of the Services or violation of
                    these Terms.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    16. Termination
                  </h3>
                  <p className="text-muted-foreground">
                    3LIXIR MUSIC may suspend or terminate access at any time.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Sections relating to ownership, royalties, payments,
                    disclaimers, and dispute resolution survive termination.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    17. Governing Law; Arbitration; Class Action Waiver
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    These Terms are governed by the laws of the State of
                    California.
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong className="text-foreground">
                      Mandatory Arbitration:
                    </strong>{" "}
                    All disputes shall be resolved by binding arbitration on an
                    individual basis, except where injunctive relief is sought.
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">
                      Class Action Waiver:
                    </strong>{" "}
                    You agree that disputes will be conducted only on an
                    individual basis and not in a class, consolidated, or
                    representative action.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    18. License Agreement
                  </h3>
                  <p className="text-muted-foreground">
                    Each Beat is also governed by a License Agreement presented
                    at checkout.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    In case of conflict, the License Agreement controls.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    19. Privacy Policy
                  </h3>
                  <p className="text-muted-foreground">
                    Use of the Services is subject to the Privacy Policy.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    20. International Users
                  </h3>
                  <p className="text-muted-foreground">
                    Users outside the U.S. are responsible for compliance with
                    local laws.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Nothing in these Terms waives non-waivable consumer rights.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    21. Changes to Terms
                  </h3>
                  <p className="text-muted-foreground">
                    Terms may be updated at any time. Continued use constitutes
                    acceptance.
                  </p>
                </section>

                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                  <p className="text-muted-foreground font-semibold">
                    END OF TERMS OF SERVICE
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
