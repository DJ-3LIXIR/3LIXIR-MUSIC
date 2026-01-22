import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Dmca() {
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
              3LIXIR MUSIC DMCA Copyright Infringement Policy
            </h1>
            <p className="text-muted-foreground mb-8">
              Last Updated: January 2026
            </p>

            <div className="space-y-6">
              <p className="text-muted-foreground">
                3LIXIR MUSIC respects the intellectual property rights of others
                and expects users of the Services to do the same. This Digital
                Millennium Copyright Act ("DMCA") Copyright Infringement Policy
                explains the procedures followed by 3LIXIR MUSIC in response to
                claims of copyright infringement under the DMCA (17 U.S.C. §
                512).
              </p>
              <p className="text-muted-foreground">
                This Policy applies to all content made available through the
                3LIXIR MUSIC platform, including but not limited to DJ 3LIXIR
                Beats, third-party licensed Beats, user-submitted materials (if
                applicable), and related Services.
              </p>
              <p className="text-muted-foreground">
                3LIXIR MUSIC is operated by DJ 3LIXIR ("we," "us").
              </p>

              <div className="space-y-8">
                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    1. Designated DMCA Agent
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Pursuant to the DMCA, 3LIXIR MUSIC has designated the
                    following agent to receive notifications of claimed
                    copyright infringement:
                  </p>
                  <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-2">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">DMCA Agent:</strong>{" "}
                      3LIXIR MUSIC
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Email:</strong>{" "}
                      <span className="text-[hsl(var(--gold))]">
                        support@3lixirmusic.com
                      </span>
                    </p>
                  </div>
                  <p className="text-muted-foreground mt-4 italic">
                    Only DMCA-compliant notices submitted to the Designated
                    Agent will be processed.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    2. Filing a DMCA Takedown Notice
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    If you believe that material available through the Services
                    infringes a copyright you own or control, you may submit a
                    written DMCA takedown notice that includes all of the
                    following:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
                    <li>
                      A physical or electronic signature of the copyright owner
                      or a person authorized to act on their behalf
                    </li>
                    <li>
                      Identification of the copyrighted work claimed to have
                      been infringed
                    </li>
                    <li>
                      Identification of the allegedly infringing material and
                      information reasonably sufficient to locate it
                    </li>
                    <li>
                      Your contact information, including name, address,
                      telephone number, and email address
                    </li>
                    <li>
                      A statement that you have a good-faith belief that the use
                      of the material is not authorized by the copyright owner,
                      its agent, or the law
                    </li>
                    <li>
                      A statement, made under penalty of perjury, that the
                      information in the notice is accurate and that you are
                      authorized to act on behalf of the copyright owner
                    </li>
                  </ol>
                  <p className="text-muted-foreground mt-4 italic">
                    Incomplete or non-compliant notices may not be processed.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    3. Our Response to Valid Notices
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Upon receipt of a valid DMCA takedown notice, 3LIXIR MUSIC
                    may, in accordance with applicable law:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      Remove or disable access to the allegedly infringing
                      material
                    </li>
                    <li>Notify the affected user or licensee</li>
                    <li>
                      Restrict, suspend, or terminate access for repeat
                      infringers
                    </li>
                    <li>
                      Take any other action deemed appropriate under the DMCA
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Nothing in this Policy requires 3LIXIR MUSIC to adjudicate
                    ownership disputes, revenue split disagreements, or
                    contractual licensing conflicts.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    4. Counter-Notification Procedure
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    If you believe that material removed or disabled pursuant to
                    a DMCA notice was removed due to mistake or
                    misidentification, you may submit a counter-notification
                    containing:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
                    <li>Your physical or electronic signature</li>
                    <li>
                      Identification of the material that was removed or
                      disabled and its prior location
                    </li>
                    <li>
                      A statement, under penalty of perjury, that you have a
                      good-faith belief the material was removed or disabled due
                      to mistake or misidentification
                    </li>
                    <li>
                      Your name, address, telephone number, and email address
                    </li>
                    <li>
                      A statement consenting to the jurisdiction of the federal
                      district court in your judicial district, or the State of
                      California if you reside outside the United States
                    </li>
                  </ol>
                  <p className="text-muted-foreground mt-4">
                    Counter-notifications must be submitted to the Designated
                    DMCA Agent listed above.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    5. Repeat Infringer Policy
                  </h3>
                  <p className="text-muted-foreground">
                    In accordance with the DMCA, 3LIXIR MUSIC maintains a policy
                    of terminating, in appropriate circumstances and at its sole
                    discretion, users who are determined to be repeat copyright
                    infringers.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    6. Misrepresentations
                  </h3>
                  <p className="text-muted-foreground">
                    Any person who knowingly materially misrepresents that
                    material or activity is infringing, or that material was
                    removed or disabled by mistake or misidentification, may be
                    subject to liability under 17 U.S.C. § 512(f).
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    7. Licensing and Contractual Disputes
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    DMCA notices must not be used to resolve:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Licensing disputes</li>
                    <li>Royalty or revenue split disagreements</li>
                    <li>Subscription or Token clearance issues</li>
                    <li>
                      Contractual conflicts under the Terms of Service or Beat
                      License Agreement
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Beats licensed through 3LIXIR MUSIC are governed exclusively
                    by the applicable Terms of Service and Beat License
                    Agreement. Improper DMCA submissions based on licensing
                    misunderstandings may be rejected.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    8. No Legal Advice
                  </h3>
                  <p className="text-muted-foreground">
                    This DMCA Policy is provided for informational purposes only
                    and does not constitute legal advice. We encourage copyright
                    owners and users to consult qualified legal counsel before
                    submitting a takedown notice or counter-notification.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    9. Changes to This Policy
                  </h3>
                  <p className="text-muted-foreground">
                    We reserve the right to update or modify this DMCA Policy at
                    any time. Changes become effective upon posting to the
                    Platform. Continued use of the Services constitutes
                    acceptance of the revised Policy.
                  </p>
                </section>

                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                  <p className="text-muted-foreground font-semibold">
                    END OF DMCA COPYRIGHT INFRINGEMENT POLICY
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
