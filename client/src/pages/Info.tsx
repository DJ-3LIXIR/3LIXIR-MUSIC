import React, { useState } from "react";
import {
  ChevronRight,
  Mail,
  Shield,
  FileText,
  Scale,
  HelpCircle,
  Phone,
  AlertCircle,
  Copyright,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const InfoPage = () => {
  const [activeSection, setActiveSection] = useState("about");

  const sections = [
    { id: "about", title: "About Us", icon: FileText },
    { id: "terms", title: "Terms of Service", icon: FileText },
    { id: "privacy", title: "Privacy Policy", icon: Shield },
    { id: "licensing", title: "Licensing Agreement", icon: Scale },
    { id: "faq", title: "FAQ", icon: HelpCircle },
    { id: "contact", title: "Contact", icon: Mail },
    { id: "refund", title: "Refund Policy", icon: AlertCircle },
    { id: "copyright", title: "Copyright & DMCA", icon: Copyright },
  ];

  const content = {
    about: (
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
            About 3LIXIR MUSIC
          </h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <div>
              <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                Our Story
              </h3>
              <p className="text-muted-foreground">
                3LIXIR MUSIC is a premium beat store dedicated to empowering
                artists with high-quality, professionally crafted instrumentals.
                We believe every artist deserves access to beats that elevate
                their sound and bring their vision to life.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                To provide artists of all levels with exceptional beats and a
                seamless licensing experience, fostering creativity and helping
                musicians create their best work.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                What We Offer
              </h3>
              <p className="text-muted-foreground">
                From Basic to Premium licenses, we provide flexible options that
                grow with your career. Whether you're recording your first track
                or dropping your next hit, 3LIXIR MUSIC has the sound you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),

    terms: (
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
          Terms of Service
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Last Updated: January 2026
        </p>

        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              1. Acceptance of Terms
            </h3>
            <p className="text-muted-foreground">
              By accessing and using 3LIXIR MUSIC ("the Site"), you accept and
              agree to be bound by these Terms of Service. If you do not agree,
              please do not use our services.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              2. Services Provided
            </h3>
            <p className="text-muted-foreground">
              3LIXIR MUSIC provides instrumental beats for license and purchase.
              All beats remain the intellectual property of 3LIXIR MUSIC or its
              producers until properly licensed.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              3. Account Responsibilities
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                You are responsible for maintaining the confidentiality of your
                account
              </li>
              <li>You must provide accurate and complete information</li>
              <li>
                You must be at least 18 years old or have parental consent
              </li>
              <li>One person per account; accounts are non-transferable</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              4. Purchasing and Payments
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>All purchases are processed securely through PayPal</li>
              <li>Prices are listed in USD unless otherwise stated</li>
              <li>
                You are responsible for any transaction fees imposed by your
                payment method
              </li>
              <li>
                Promotional codes and discounts cannot be combined unless
                explicitly stated
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              5. Prohibited Uses
            </h3>
            <p className="text-muted-foreground mb-2">You may NOT:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Resell, redistribute, or share the beat files</li>
              <li>Claim ownership or authorship of the beat</li>
              <li>Use the beat for unlawful purposes</li>
              <li>Remove or alter producer tags on unleased versions</li>
              <li>Exceed the usage limits of your license tier</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              6. Limitation of Liability
            </h3>
            <p className="text-muted-foreground">
              3LIXIR MUSIC is not liable for any indirect, incidental, or
              consequential damages arising from use of our services.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              7. Governing Law
            </h3>
            <p className="text-muted-foreground">
              These terms are governed by the laws of the United States, without
              regard to conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    ),

    privacy: (
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
          Privacy Policy
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Last Updated: January 2026
        </p>

        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Information We Collect
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium mb-2">
                  Personal Information:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Name and email address</li>
                  <li>PayPal transaction information</li>
                  <li>IP address and browser information</li>
                  <li>Purchase history and download records</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2">
                  Automatically Collected:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Cookies and tracking technologies</li>
                  <li>Website usage data and analytics</li>
                  <li>Device and browser type</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              How We Use Your Information
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Process orders and deliver purchased beats</li>
              <li>Send purchase confirmations and license agreements</li>
              <li>Provide customer support</li>
              <li>Send promotional emails (you can opt-out anytime)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Information Sharing
            </h3>
            <p className="text-muted-foreground mb-2">
              We do NOT sell your personal information. We may share data with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Payment processors (PayPal) to complete transactions</li>
              <li>Email service providers for communications</li>
              <li>Analytics services to improve our site</li>
              <li>Law enforcement if legally required</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Your Rights
            </h3>
            <p className="text-muted-foreground mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Data Security
            </h3>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your
              information. However, no method of transmission over the internet
              is 100% secure.
            </p>
          </section>
        </div>
      </div>
    ),

    licensing: (
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
          Licensing Agreement
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Last Updated: January 2026
        </p>

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h3 className="text-2xl font-display font-semibold tracking-tight mb-4">
                BASIC LICENSE
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Streaming: Up to 500,000 streams</li>
                <li>• Music Videos: 1 video (500K views)</li>
                <li>• Audio Sales: Up to 5,000 copies</li>
                <li>• Live Performances: Unlimited</li>
                <li>• Radio: Up to 2 stations</li>
                <li>• Producer Credit: Required</li>
                <li>• Format: MP3 or WAV</li>
                <li className="text-yellow-500">
                  • Non-exclusive, tag may remain
                </li>
              </ul>
            </div>

            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h3 className="text-2xl font-display font-semibold tracking-tight mb-4">
                PREMIUM LICENSE
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Streaming: Up to 2,000,000 streams</li>
                <li>• Music Videos: Unlimited (2M views each)</li>
                <li>• Audio Sales: Up to 20,000 copies</li>
                <li>• Live Performances: Unlimited</li>
                <li>• Radio: Unlimited</li>
                <li>• Producer Credit: Required</li>
                <li>• Format: WAV + Trackouts</li>
                <li className="text-green-500">• Non-exclusive, tag-free</li>
              </ul>
            </div>
          </div>

          <div className="border border-[hsl(var(--gold))]/30 rounded-xl p-6 bg-[hsl(var(--gold))]/5">
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-4">
              EXCLUSIVE LICENSE
            </h3>
            <p className="text-muted-foreground mb-4">Contact for pricing</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Full ownership of the beat</li>
              <li>• Unlimited usage rights</li>
              <li>• Producer removes beat from store</li>
              <li>• WAV + Trackout stems included</li>
              <li>• Custom terms negotiable</li>
            </ul>
          </div>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              General Terms
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Producer Credit:</strong>{" "}
                You must credit "Prod. by 3LIXIR MUSIC" on all releases
              </li>
              <li>
                <strong className="text-foreground">Non-Exclusive:</strong>{" "}
                Basic and Premium licenses allow the beat to be licensed to
                others
              </li>
              <li>
                <strong className="text-foreground">Exceeding Limits:</strong>{" "}
                Must upgrade to a higher tier if limits are exceeded
              </li>
              <li>
                <strong className="text-foreground">Modifications:</strong> You
                may record vocals and arrange, but cannot alter and resell the
                instrumental
              </li>
              <li>
                <strong className="text-foreground">Ownership:</strong> 3LIXIR
                MUSIC retains copyright unless Exclusive License purchased
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              What You CANNOT Do
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Resell or redistribute the beat</li>
              <li>Register with Content ID or similar systems</li>
              <li>Claim exclusive ownership (unless Exclusive License)</li>
              <li>Remove producer credit requirements</li>
              <li>
                Use for commercial advertisements without written permission
              </li>
            </ul>
          </section>
        </div>
      </div>
    ),

    faq: (
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <div className="border-b border-white/10 pb-6">
            <h3 className="text-xl font-semibold mb-2">
              How do I purchase a beat?
            </h3>
            <p className="text-muted-foreground">
              Browse our catalog, select your beat, choose a license tier, and
              complete checkout via PayPal. You'll receive instant download
              access.
            </p>
          </div>

          <div className="border-b border-white/10 pb-6">
            <h3 className="text-xl font-semibold mb-2">
              What file formats do you provide?
            </h3>
            <p className="text-muted-foreground">
              Basic licenses include MP3. Premium and Exclusive licenses include
              WAV files and/or trackout stems.
            </p>
          </div>

          <div className="border-b border-white/10 pb-6">
            <h3 className="text-xl font-semibold mb-2">
              What's the difference between Basic and Premium?
            </h3>
            <p className="text-muted-foreground">
              Premium offers higher usage limits, tag-free versions, and higher
              quality files (WAV/trackouts).
            </p>
          </div>

          <div className="border-b border-white/10 pb-6">
            <h3 className="text-xl font-semibold mb-2">
              Can multiple artists buy the same beat?
            </h3>
            <p className="text-muted-foreground">
              Yes, unless someone purchases an Exclusive License, which removes
              the beat from our store.
            </p>
          </div>

          <div className="border-b border-white/10 pb-6">
            <h3 className="text-xl font-semibold mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-muted-foreground">
              Currently PayPal, with Cash App coming soon.
            </p>
          </div>

          <div className="border-b border-white/10 pb-6">
            <h3 className="text-xl font-semibold mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-muted-foreground">
              Due to the digital nature of our products, all sales are final.
              Please review carefully before purchase.
            </p>
          </div>

          <div className="border-b border-white/10 pb-6">
            <h3 className="text-xl font-semibold mb-2">
              Do I own the beat after purchasing?
            </h3>
            <p className="text-muted-foreground">
              You own the right to USE the beat according to your license terms.
              3LIXIR MUSIC retains copyright ownership unless you purchase an
              Exclusive License.
            </p>
          </div>

          <div className="border-b border-white/10 pb-6">
            <h3 className="text-xl font-semibold mb-2">
              Can I use the beat on Spotify, Apple Music, etc.?
            </h3>
            <p className="text-muted-foreground">
              Yes, within your license tier's distribution limits.
            </p>
          </div>

          <div className="border-b border-white/10 pb-6">
            <h3 className="text-xl font-semibold mb-2">
              What happens if I exceed my license limits?
            </h3>
            <p className="text-muted-foreground">
              You must upgrade to the next tier. Contact us to discuss your
              options.
            </p>
          </div>

          <div className="pb-6">
            <h3 className="text-xl font-semibold mb-2">
              I didn't receive my download link. What do I do?
            </h3>
            <p className="text-muted-foreground">
              Check your spam folder first. If you still can't find it, contact
              us with your order number.
            </p>
          </div>
        </div>
      </div>
    ),

    contact: (
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
          Contact Us
        </h2>

        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Get In Touch
            </h3>
            <p className="text-muted-foreground mb-6">
              Have questions, need support, or want to discuss custom work?
              We're here to help.
            </p>

            <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[hsl(var(--gold))]" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">
                    contact@3lixirmusic.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[hsl(var(--gold))]" />
                <div>
                  <p className="font-semibold">Response Time</p>
                  <p className="text-muted-foreground">Within 24-48 hours</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Business Inquiries
            </h3>
            <p className="text-muted-foreground">
              For custom beats, exclusive deals, or partnerships, reach out via
              email with "Business Inquiry" in the subject line.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Technical Support
            </h3>
            <p className="text-muted-foreground">
              Experiencing issues with downloads or licensing? Contact us with
              your order number for fastest assistance.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Social Media
            </h3>
            <p className="text-muted-foreground mb-4">
              Follow us for new releases, promotions, and updates:
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium">
                Instagram
              </button>
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium">
                Twitter
              </button>
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium">
                YouTube
              </button>
            </div>
          </section>
        </div>
      </div>
    ),

    refund: (
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
          Refund & Return Policy
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Last Updated: January 2026
        </p>

        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Digital Products Policy
            </h3>
            <p className="text-muted-foreground">
              Due to the nature of digital downloads,{" "}
              <strong className="text-foreground">all sales are final</strong>.
              Once you receive access to download your beat and license, we
              cannot offer refunds.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Before You Purchase
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Listen to the full preview carefully</li>
              <li>Review the license terms for your selected tier</li>
              <li>Ensure you're purchasing the correct license type</li>
              <li>Verify your email address is correct for delivery</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Exceptions
            </h3>
            <p className="text-muted-foreground mb-2">
              Refunds may be issued only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                You were charged multiple times for the same purchase (duplicate
                charge)
              </li>
              <li>Technical error prevented you from receiving your files</li>
              <li>
                You purchased the wrong license tier (must contact us within 24
                hours)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              How to Request a Refund (If Eligible)
            </h3>
            <p className="text-muted-foreground mb-2">Email us with:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Your order number</li>
              <li>Date of purchase</li>
              <li>Reason for refund request</li>
              <li>PayPal transaction ID</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We will review your request within 2-3 business days.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold tracking-tight mb-3">
              Chargebacks
            </h3>
            <p className="text-muted-foreground">
              Initiating a chargeback without contacting us first may result in
              permanent ban from our services and legal action.
            </p>
          </section>
        </div>
      </div>
    ),

    copyright: (
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
          Copyright & DMCA Policy
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Last Updated: January 2026
        </p>

        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Copyright Protection
            </h3>
            <p className="text-muted-foreground">
              All beats and content on 3LIXIR MUSIC are protected by United
              States and international copyright laws. Unauthorized
              reproduction, distribution, or use is strictly prohibited.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Ownership
            </h3>
            <p className="text-muted-foreground">
              3LIXIR MUSIC (or its affiliated producers) owns all rights, title,
              and interest in the beats until properly licensed. Purchasing a
              license grants you specific usage rights but does NOT transfer
              copyright ownership (except for Exclusive Licenses).
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Filing a DMCA Takedown Notice
            </h3>
            <p className="text-muted-foreground mb-2">
              If you believe your copyrighted work has been infringed upon on
              our site, submit a written notice including:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Your physical or electronic signature</li>
              <li>
                Identification of the copyrighted work claimed to be infringed
              </li>
              <li>Identification of the material claimed to be infringing</li>
              <li>Your contact information (address, phone, email)</li>
              <li>
                A statement that you have a good faith belief the use is not
                authorized
              </li>
              <li>
                A statement under penalty of perjury that the information is
                accurate
              </li>
            </ol>
            <p className="text-muted-foreground mt-4">
              Send notices to:{" "}
              <span className="text-[hsl(var(--gold))]">
                dmca@3lixirmusic.com
              </span>
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Counter-Notice
            </h3>
            <p className="text-muted-foreground">
              If you believe your content was wrongly removed, you may file a
              counter-notice with the same information plus a statement
              consenting to jurisdiction of Federal District Court.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              Repeat Infringers
            </h3>
            <p className="text-muted-foreground">
              We will terminate accounts of repeat copyright infringers.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              False Claims
            </h3>
            <p className="text-muted-foreground">
              Making false DMCA claims may result in legal liability.
            </p>
          </section>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">
            Information Center
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about 3LIXIR MUSIC
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? "bg-[hsl(var(--gold))]/10 text-foreground border border-[hsl(var(--gold))]/30"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-transparent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-left flex-1">
                      {section.title}
                    </span>
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="border border-white/10 rounded-2xl p-8 md:p-12 bg-white/5">
              {content[activeSection]}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2026 3LIXIR MUSIC. All rights reserved.</p>
            <p className="text-sm mt-2">
              Questions? Contact us at{" "}
              <span className="text-[hsl(var(--gold))]">
                contact@3lixirmusic.com
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
