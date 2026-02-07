import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Privacy() {
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
              3LIXIR MUSIC Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-8">
              Last Updated: January 2026
            </p>

            <div className="space-y-6">
              <p className="text-muted-foreground">
                This Privacy Policy describes how{" "}
                <strong className="text-foreground">3LIXIR MUSIC</strong> ("we,"
                "us") collects, uses, discloses, and protects personal
                information when you access or use our website, platform,
                subscriptions, digital products, Beats, and related services
                (collectively, the "Services").
              </p>
              <p className="text-muted-foreground">
                This Privacy Policy is incorporated by reference into the 3LIXIR
                MUSIC Terms of Service.
              </p>

              <div className="space-y-8">
                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    1. Information We Collect
                  </h3>

                  <h4 className="text-xl font-medium mb-3 mt-6">
                    1.1 Information You Provide Directly
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    We may collect information you voluntarily provide,
                    including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      Name, username, and contact information (such as email
                      address)
                    </li>
                    <li>Account credentials</li>
                    <li>
                      Billing-related information (processed by third-party
                      payment providers)
                    </li>
                    <li>
                      Communications with us, including support requests and
                      emails
                    </li>
                  </ul>

                  <h4 className="text-xl font-medium mb-3 mt-6">
                    1.2 Information Collected Automatically
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    When you use the Services, we may automatically collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>IP address</li>
                    <li>Device type, browser type, and operating system</li>
                    <li>Pages viewed, referring URLs, and usage activity</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>

                  <h4 className="text-xl font-medium mb-3 mt-6">
                    1.3 Payment Information
                  </h4>
                  <p className="text-muted-foreground">
                    3LIXIR MUSIC does not store full payment card details.
                    Payments for Royalty Tokens, Subscriptions, and other
                    services are processed by third-party payment processors in
                    accordance with their own privacy policies.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    2. How We Use Information
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    We use personal information to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Provide, operate, and maintain the Services</li>
                    <li>
                      Process transactions, Subscriptions, and Royalty Tokens
                    </li>
                    <li>Manage user accounts and access</li>
                    <li>
                      Communicate service-related notices, updates, and support
                      messages
                    </li>
                    <li>Enforce our Terms of Service and License Agreements</li>
                    <li>
                      Monitor licensing compliance and royalty obligations
                    </li>
                    <li>
                      Detect, prevent, and address fraud, abuse, or technical
                      issues
                    </li>
                    <li>Comply with legal and regulatory requirements</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    3. Cookies and Tracking Technologies
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Authenticate users</li>
                    <li>Remember preferences</li>
                    <li>Analyze usage and improve the Services</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    You may control cookie settings through your browser.
                    Disabling cookies may limit certain features of the
                    Services.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    4. How We Share Information
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    We may share personal information with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      Service providers that assist with hosting, analytics,
                      communications, payment processing, and platform
                      operations
                    </li>
                    <li>
                      Rights management, licensing, and enforcement partners
                      where necessary to administer royalty splits and protect
                      intellectual property
                    </li>
                    <li>
                      Legal authorities when required by law or to protect our
                      rights, users, or Services
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    We do <strong className="text-foreground">not</strong> sell
                    personal information.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    5. Data Retention
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    We retain personal information only as long as reasonably
                    necessary to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Provide the Services</li>
                    <li>Maintain licensing and royalty records</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes and enforce agreements</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    6. Data Security
                  </h3>
                  <p className="text-muted-foreground">
                    We implement reasonable administrative, technical, and
                    physical safeguards designed to protect personal
                    information. However, no method of transmission or storage
                    is completely secure, and we cannot guarantee absolute
                    security.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    7. Your Rights and Choices
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Depending on your jurisdiction, you may have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Access, correct, or delete personal information</li>
                    <li>Object to or restrict certain processing</li>
                    <li>Withdraw consent where applicable</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Requests may be submitted using the contact information
                    below.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    8. California Privacy Rights (CCPA / CPRA)
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    If you are a California resident, you may have additional
                    rights under the CCPA and CPRA, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      The right to know what personal information is collected
                      and how it is used
                    </li>
                    <li>
                      The right to request deletion of personal information,
                      subject to legal exceptions
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    3LIXIR MUSIC does not discriminate against users for
                    exercising privacy rights.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    9. International Users
                  </h3>
                  <p className="text-muted-foreground">
                    If you access the Services from outside the United States,
                    your information may be transferred to and processed in the
                    United States, where data protection laws may differ from
                    those in your jurisdiction.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    10. Children's Privacy
                  </h3>
                  <p className="text-muted-foreground">
                    The Services are not intended for individuals under the age
                    of eighteen (18). We do not knowingly collect personal
                    information from children.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    11. Third-Party Links and Services
                  </h3>
                  <p className="text-muted-foreground">
                    The Services may contain links to or integrations with
                    third-party services. We are not responsible for the privacy
                    practices or content of third parties.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    12. Changes to This Privacy Policy
                  </h3>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. Updates
                    become effective upon posting. Continued use of the Services
                    constitutes acceptance of the revised Privacy Policy.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                    13. Contact Information
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    For privacy questions or requests, contact:
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
                    END OF PRIVACY POLICY
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
