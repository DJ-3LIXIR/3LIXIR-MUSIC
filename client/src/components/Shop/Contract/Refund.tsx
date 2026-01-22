import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Refund() {
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
              3LIXIR MUSIC Refund & Cancellation Policy
            </h1>
            <p className="text-muted-foreground mb-8">
              Last Updated: January 2026
            </p>

            <div className="space-y-6">
              <p className="text-muted-foreground">
                This Refund & Cancellation Policy explains how refunds,
                cancellations, billing disputes, and payment-related issues are
                handled for purchases made through the 3LIXIR MUSIC platform
                ("Platform").
              </p>
              <p className="text-muted-foreground">
                This Policy is incorporated by reference into the 3LIXIR MUSIC
                Terms of Service, Beat License Agreement, and Return Policy.
              </p>
              <p className="text-muted-foreground">
                3LIXIR MUSIC is operated by DJ 3LIXIR ("we," "us").
              </p>

              <div className="space-y-8">
                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    1. General Policy
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Due to the digital nature of our products and services,{" "}
                    <strong className="text-foreground">
                      all sales are final
                    </strong>
                    , except where refunds are expressly required by applicable
                    law.
                  </p>
                  <p className="text-muted-foreground">
                    By purchasing, subscribing to, or using any 3LIXIR MUSIC
                    product or Service, you acknowledge and agree to this Refund
                    & Cancellation Policy.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    2. Non-Refundable Items
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    The following are strictly non-refundable:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Digital Beat purchases or licenses</li>
                    <li>Royalty clearance Tokens</li>
                    <li>Downloaded or accessed digital content</li>
                    <li>
                      Subscription fees (including partial or unused billing
                      periods)
                    </li>
                    <li>Production or custom services once work has begun</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Once a Beat or digital product has been delivered, accessed,
                    downloaded, licensed, or used for clearance, it is
                    considered consumed and ineligible for refund.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    3. Subscriptions and Cancellations
                  </h3>

                  <h4 className="text-xl font-medium mb-3 mt-6">
                    3.1 Subscription Billing
                  </h4>
                  <p className="text-muted-foreground">
                    Subscriptions are billed on a recurring basis as disclosed
                    at checkout and continue until canceled.
                  </p>

                  <h4 className="text-xl font-medium mb-3 mt-6">
                    3.2 Cancellation
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    You may cancel your Subscription at any time through your
                    account dashboard or by contacting support.
                  </p>
                  <p className="text-muted-foreground mb-2">Cancellation:</p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Stops future billing</li>
                    <li>Does not refund the current billing period</li>
                    <li>
                      Does not preserve royalty clearance unless Publication
                      occurred during an active Subscription, as defined in the
                      Terms of Service
                    </li>
                    <li>
                      Does not revoke rights properly granted during an active
                      Subscription term
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Access to Subscription-only features may terminate
                    immediately or at the end of the billing cycle, depending on
                    the plan.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    4. Tokens
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Tokens are digital royalty clearance credits and:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Have no cash value</li>
                    <li>Are non-refundable</li>
                    <li>Are non-transferable</li>
                    <li>Apply on a per-Beat basis</li>
                    <li>Are forfeited if unused</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Once a Token is applied, the royalty clearance for the
                    associated Beat is permanent and irreversible.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    5. Exceptional Circumstances
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Refunds may be considered solely at the discretion of 3LIXIR
                    MUSIC in limited circumstances, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Duplicate charges caused by technical error</li>
                    <li>Confirmed billing errors by a payment processor</li>
                    <li>
                      Platform failures that prevented access after verified
                      payment
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4 mb-2">
                    Refunds will not be issued for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Dissatisfaction or change of mind</li>
                    <li>Lack of use</li>
                    <li>Misunderstanding of license terms</li>
                    <li>Failure to review documentation</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Any resolution may take the form of account credit,
                    corrected access, or replacement—not necessarily a monetary
                    refund.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    6. Chargebacks and Payment Disputes
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Initiating a chargeback or payment dispute without first
                    contacting 3LIXIR MUSIC may result in:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Immediate suspension or termination of your account</li>
                    <li>Revocation of access to Services</li>
                    <li>
                      Loss of granted licenses, royalty clearance, or benefits
                    </li>
                    <li>
                      Permanent restriction from future use of the Platform
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    We reserve the right to dispute chargebacks and submit
                    supporting documentation to payment processors and financial
                    institutions.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    7. Mistaken Purchases
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Mistaken purchases, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Purchasing the wrong Beat</li>
                    <li>
                      Misunderstanding licensing, splits, or clearance rules
                    </li>
                    <li>Purchasing without intended use</li>
                    <li>
                      Failure to review the Terms of Service or License
                      Agreement
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    do not qualify for refunds, reversals, or credits.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    8. Relationship to Return Policy
                  </h3>
                  <p className="text-muted-foreground">
                    This Refund & Cancellation Policy operates in conjunction
                    with the Return Policy.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Because all products and Services are digital, no physical
                    returns are possible.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    9. Legal Compliance
                  </h3>
                  <p className="text-muted-foreground">
                    Nothing in this Policy limits non-waivable rights under
                    applicable consumer protection laws. Where a refund is
                    legally required, we will comply to the extent required by
                    law.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    10. Changes to This Policy
                  </h3>
                  <p className="text-muted-foreground">
                    We may update or modify this Refund & Cancellation Policy at
                    any time. Changes become effective upon posting to the
                    Platform. Continued use constitutes acceptance of the
                    revised Policy.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    11. Contact Information
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    For billing questions, disputes, or cancellation assistance,
                    contact:
                  </p>
                  <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-2">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">3LIXIR MUSIC</strong>
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
                    END OF REFUND & CANCELLATION POLICY
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
