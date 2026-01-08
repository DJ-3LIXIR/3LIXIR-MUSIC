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
  Music,
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SupportArtist } from "@/components/Info/SupportArtist";
import MeetTheArtistBanner from "@/components/Info/MeetTheArtistBanner";

const InfoPage = () => {
  const [activeSection, setActiveSection] = useState("about");
  const [activePolicySection, setActivePolicySection] = useState("terms");
  const [activeAboutSection, setActiveAboutSection] = useState("story");
  const [activeArtistSection, setActiveArtistSection] = useState("dj3lixir");
  const [location] = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const section = searchParams.get("section");

    if (section) {
      // Check if it's a policy subsection (terms, privacy, licensing, refund, copyright, faq)
      const policySubsections = [
        "terms",
        "privacy",
        "licensing",
        "refund",
        "copyright",
        "faq",
      ];

      if (policySubsections.includes(section)) {
        setActiveSection("policy");
        setActivePolicySection(section);
      } else {
        // It's a main section (about, artist, policy, contact)
        setActiveSection(section);
      }
    }

    // Handle hash scrolling after section loads
    if (window.location.hash) {
      setTimeout(() => {
        const element = document.querySelector(window.location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [location]);
  const sections = [
    { id: "about", title: "About Us", icon: FileText },
    { id: "artist", title: "Artist", icon: Music },
    { id: "policy", title: "Policy", icon: Shield },
    { id: "contact", title: "Contact", icon: Mail },
  ];
  const policySections = [
    { id: "terms", title: "Terms of Service", icon: FileText },
    { id: "privacy", title: "Privacy Policy", icon: Shield },
    { id: "licensing", title: "Licensing Agreement", icon: Scale },
    { id: "refund", title: "Refund Policy", icon: AlertCircle },
    { id: "copyright", title: "Copyright & DMCA", icon: Copyright },
    { id: "faq", title: "FAQ", icon: HelpCircle },
  ];
  const content = {
    about: (
      <div className="w-full -m-8 md:-m-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* About Sidebar Navigation - Vertical */}
          <div className="lg:w-64 flex-shrink-0 p-8 md:p-12 lg:pl-12 lg:pr-0 lg:pt-8 lg:pb-0">
            {/* Mobile: Horizontal scrollable */}
            <div className="lg:hidden overflow-x-auto mb-8">
              <div className="flex gap-2 pb-2">
                {[
                  { id: "story", title: "Our Story", icon: FileText },
                  { id: "mission", title: "Our Mission", icon: FileText },
                  { id: "offer", title: "What We Offer", icon: FileText },
                ].map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveAboutSection(section.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap text-sm ${
                        activeAboutSection === section.id
                          ? "bg-[hsl(var(--gold))] text-black font-semibold"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop: Vertical sidebar */}
            <div className="hidden lg:block space-y-2">
              {[
                { id: "story", title: "Our Story", icon: FileText },
                { id: "mission", title: "Our Mission", icon: FileText },
                { id: "offer", title: "What We Offer", icon: FileText },
              ].map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveAboutSection(section.id)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all w-full text-left group ${
                      activeAboutSection === section.id
                        ? "bg-[hsl(var(--gold))] text-black font-semibold shadow-lg shadow-[hsl(var(--gold))]/20"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{section.title}</span>
                    {activeAboutSection === section.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* About Content Area */}
          <div className="flex-1 min-w-0 p-8 md:p-12 lg:pr-12 lg:pl-8 lg:pt-8 lg:pb-0">
            {activeAboutSection === "story" && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  Our Story
                </h2>
                <div className="text-lg leading-relaxed text-muted-foreground space-y-4">
                  <p>
                    3LIXIR Music was born from a simple belief: great music
                    deserves intention, not shortcuts. What started as late
                    nights, headphones on, and melodies built from instinct
                    quickly became something bigger. The goal was never just to
                    make beats—it was to create sound with purpose, tracks that
                    artists could feel, build on, and turn into something
                    timeless.
                  </p>
                  <p>
                    Every drum hit, every chord, every texture was treated like
                    an ingredient in a formula meant to elevate the final
                    record. As the catalog grew, so did the vision. 3LIXIR Music
                    evolved into a platform for artists who want more than
                    generic production—artists who want identity, quality, and
                    control.
                  </p>
                  <p>
                    From carefully crafted beats to clear rights management and
                    hands-on production services, everything we offer is
                    designed to remove friction and let creativity flow. The
                    name 3LIXIR represents refinement: taking raw ideas and
                    distilling them into something powerful. That same
                    philosophy guides everything we do today.
                  </p>
                  <p>
                    We're building more than a beat store—we're building a
                    creative ecosystem where artists can find their sound,
                    protect their work, and scale their careers. This is just
                    the beginning. And the next record could be yours.
                  </p>
                </div>
              </div>
            )}

            {activeAboutSection === "mission" && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  Our Mission
                </h2>
                <div className="text-lg leading-relaxed text-muted-foreground space-y-4">
                  <p>
                    At 3LIXIR Music, our mission is to put artists first—always.
                    We are unapologetically pro-artist and anti-AI exploitation.
                    We believe music should be created by people, not harvested
                    from them. In an industry increasingly driven by shortcuts,
                    automation, and faceless systems, we stand for human
                    creativity, originality, and earned expression.
                  </p>
                  <p>
                    Art is not data. Sound is not disposable. And artists are
                    not replaceable.
                  </p>
                  <p>
                    3LIXIR Music exists to create real change in the music
                    industry by giving independent artists access to
                    high-quality production, transparent rights management, and
                    a platform built on respect—not extraction. We aim to remove
                    barriers, not create new ones.
                  </p>
                  <p>
                    Every beat, service, and collaboration is designed to
                    empower artists to own their work, define their sound, and
                    move on their own terms. We are building more than a beat
                    store. We are building a home for independent creators—a
                    space where individuality is protected, talent is nurtured,
                    and creativity is treated as currency.
                  </p>
                  <p>
                    Whether you're just starting out or refining your legacy,
                    3LIXIR Music is here to support artists who value
                    authenticity over trends and craftsmanship over convenience.
                    The future of music should be fair, human, and
                    artist-driven. That's the future we're committed to
                    creating.
                  </p>
                </div>
              </div>
            )}

            {activeAboutSection === "offer" && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  What We Offer
                </h2>
                <div className="text-lg leading-relaxed text-muted-foreground space-y-6">
                  <p>
                    We specialize in crafting premium beats and custom
                    productions across EDM, Hip Hop, Lo-Fi, Pop, Jazz, Dubstep,
                    and House, providing upcoming artists with the sonic
                    foundation they need to break through the noise and claim
                    their space in the industry.
                  </p>

                  <div className="space-y-6 mt-8">
                    <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                      <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                        Beat Leasing
                      </h3>
                      <p className="text-muted-foreground">
                        Access professional, radio-ready instrumentals that fit
                        your budget and elevate your sound without breaking the
                        bank.
                      </p>
                    </div>

                    <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                      <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                        Exclusive Beats
                      </h3>
                      <p className="text-muted-foreground">
                        Own the rights. Own the moment. Exclusive productions
                        designed specifically for artists ready to make their
                        mark with something nobody else has.
                      </p>
                    </div>

                    <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                      <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                        Custom Production
                      </h3>
                      <p className="text-muted-foreground">
                        Your vision, our execution. From concept to completion,
                        we build tracks tailored to your unique style, story,
                        and sound—because cookie-cutter doesn't cut it anymore.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      Why 3LIXIR?
                    </h3>
                    <p className="text-muted-foreground">
                      Because this isn't just another producer churning out
                      generic beats. This is 3LIXIR—a commitment to quality,
                      versatility, and understanding that your music deserves
                      more than a template. We meet you where you are and push
                      you where you need to be. Whether you're dropping your
                      first single or building your catalog, we're here to
                      provide the production that matches your ambition.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),

    artist: (
      <div className="space-y-0">
        <MeetTheArtistBanner />

        {/* Artist Section with Vertical Nav */}
        <div className="w-full -m-8 md:-m-12" style={{ marginTop: "50px" }}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Artist Sidebar Navigation - Vertical */}
            <div className="lg:w-64 flex-shrink-0 p-8 md:p-12 lg:pl-12 lg:pr-0 lg:pt-8 lg:pb-0">
              {/* Mobile: Horizontal scrollable */}
              <div className="lg:hidden overflow-x-auto mb-8">
                <div className="flex gap-2 pb-2">
                  {[
                    { id: "dj3lixir", title: "DJ 3LIXIR", icon: Music },
                    { id: "future", title: "Future Artist", icon: Music },
                  ].map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveArtistSection(section.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap text-sm ${
                          activeArtistSection === section.id
                            ? "bg-[hsl(var(--gold))] text-black font-semibold"
                            : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{section.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Desktop: Vertical sidebar */}
              <div className="hidden lg:block space-y-2">
                {[
                  { id: "dj3lixir", title: "DJ 3LIXIR", icon: Music },
                  { id: "future", title: "Future Artist", icon: Music },
                ].map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveArtistSection(section.id)}
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all w-full text-left group ${
                        activeArtistSection === section.id
                          ? "bg-[hsl(var(--gold))] text-black font-semibold shadow-lg shadow-[hsl(var(--gold))]/20"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{section.title}</span>
                      {activeArtistSection === section.id && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Artist Content Area */}
            <div className="flex-1 min-w-0 p-8 md:p-12 lg:pr-12 lg:pl-8 lg:pt-8 lg:pb-0">
              {activeArtistSection === "dj3lixir" && (
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                    DJ 3LIXIR
                  </h2>

                  {/* Artist Image - Left side, text wraps around */}
                  <img
                    src="/placeholder-artist.jpg"
                    alt="DJ 3LIXIR"
                    className="w-64 h-auto rounded-xl border border-white/10 float-left mr-6 mb-4"
                  />

                  <div className="space-y-8">
                    <section>
                      <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                        About DJ 3LIXIR
                      </h3>
                      <p className="text-muted-foreground">
                        DJ 3LIXIR is an Orange County–based producer and DJ
                        whose sound is shaped by a lifetime of listening,
                        experimentation, and independent study. Born in New York
                        and later building his creative operations in Irvine,
                        California, his musical journey bridges East Coast roots
                        with West Coast vision. Working primarily in Logic Pro
                        and FL Studio, DJ 3LIXIR crafts music using a wide range
                        of plugins, instruments, and equipment, treating
                        production as both a technical discipline and an art
                        form. His sound is intentionally genre-fluid, pulling
                        from EDM, pop, rap, ’80s rock, boom bap, lo-fi, and
                        jazz, often blending styles to create something familiar
                        yet distinct. Though not formally trained, DJ 3LIXIR
                        spent four years in focused independent study, learning
                        music through hands-on creation, deep listening, and
                        constant refinement. His musical foundation began
                        earlier as a high school musician, where he developed a
                        strong connection to live performance and composition.
                        Today, he continues to play both piano and saxophone,
                        grounding his production work in real instrumentation
                        and musicality. Music has always been central to his
                        life. Growing up with the radio constantly playing, DJ
                        3LIXIR absorbed sounds across decades and genres,
                        developing an instinctive understanding of rhythm,
                        melody, and emotion. That lifelong exposure continues to
                        inform his work, allowing him to approach each track
                        with intention, curiosity, and respect for the craft. At
                        the core of everything is a simple truth: he loves
                        music. Not as content, not as data, but as expression.
                        That love drives both his sound and the creation of
                        platforms like 3LIXIR Music, built to support artists,
                        originality, and human creativity in an industry that
                        too often forgets its roots.
                      </p>
                    </section>
                  </div>
                </div>
              )}

              {activeArtistSection === "future" && (
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                    Future Artist
                  </h2>

                  <div className="text-center py-16">
                    <p className="text-2xl text-muted-foreground mb-4">
                      Host Your Music With Us
                    </p>
                    <p className="text-muted-foreground">
                      3LIXIR Music isn’t just a place to buy beats — it’s a
                      place for artists to be heard. We offer independent
                      creators the opportunity to host their music directly on
                      our platform, giving your work a home that values
                      artistry, ownership, and intention. No algorithms
                      exploiting your sound. No AI dilution. Just real music,
                      presented the way it should be. The only requirement to be
                      featured is that your music is already live on YouTube.
                      This allows us to properly showcase, embed, and promote
                      your work while keeping the process simple and accessible
                      for independent artists at any stage. By hosting your
                      music with 3LIXIR, you become part of a curated,
                      artist-driven ecosystem built to spotlight originality and
                      support creative growth. Your music stays yours — we don’t
                      claim ownership, train models on it, or strip it of value.
                      We simply provide the space, the infrastructure, and the
                      respect your work deserves. This is a platform for artists
                      who want visibility without compromise, community without
                      competition, and a place where independent voices matter.
                      If you’re serious about your craft and ready to stand
                      alongside artists who believe in the future of human-made
                      music, there’s a place for you here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SupportArtist QR Code Section - Outside the boxed content */}
        <div
          className="mt-12"
          id="support-section"
          style={{ marginTop: "100px" }}
        >
          <SupportArtist />
        </div>
      </div>
    ),

    policy: (
      <div className="w-full -m-8 md:-m-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Policy Sidebar Navigation - Vertical */}
          <div className="lg:w-64 flex-shrink-0 p-8 md:p-12 lg:pl-12 lg:pr-0 lg:pt-8 lg:pb-0">
            {/* Mobile: Horizontal scrollable */}
            <div className="lg:hidden overflow-x-auto mb-8">
              <div className="flex gap-2 pb-2">
                {policySections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActivePolicySection(section.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap text-sm ${
                        activePolicySection === section.id
                          ? "bg-[hsl(var(--gold))] text-black font-semibold"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop: Vertical sidebar */}
            <div className="hidden lg:block space-y-2">
              {policySections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActivePolicySection(section.id)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all w-full text-left group ${
                      activePolicySection === section.id
                        ? "bg-[hsl(var(--gold))] text-black font-semibold shadow-lg shadow-[hsl(var(--gold))]/20"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{section.title}</span>
                    {activePolicySection === section.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Policy Content Area */}
          <div className="flex-1 min-w-0 p-8 md:p-12 lg:pr-12 lg:pl-8 lg:pt-8 lg:pb-0">
            {activePolicySection === "terms" && (
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
                      By accessing and using 3LIXIR MUSIC ("the Site"), you
                      accept and agree to be bound by these Terms of Service. If
                      you do not agree, please do not use our services.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      2. Services Provided
                    </h3>
                    <p className="text-muted-foreground">
                      3LIXIR MUSIC provides instrumental beats for license and
                      purchase. All beats remain the intellectual property of
                      3LIXIR MUSIC or its producers until properly licensed.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      3. Account Responsibilities
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>
                        You are responsible for maintaining the confidentiality
                        of your account
                      </li>
                      <li>
                        You must provide accurate and complete information
                      </li>
                      <li>
                        You must be at least 18 years old or have parental
                        consent
                      </li>
                      <li>
                        One person per account; accounts are non-transferable
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      4. Purchasing and Payments
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>
                        All purchases are processed securely through PayPal
                      </li>
                      <li>Prices are listed in USD unless otherwise stated</li>
                      <li>
                        You are responsible for any transaction fees imposed by
                        your payment method
                      </li>
                      <li>
                        Promotional codes and discounts cannot be combined
                        unless explicitly stated
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
                      <li>
                        Remove or alter producer tags on unleased versions
                      </li>
                      <li>Exceed the usage limits of your license tier</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      6. Limitation of Liability
                    </h3>
                    <p className="text-muted-foreground">
                      3LIXIR MUSIC is not liable for any indirect, incidental,
                      or consequential damages arising from use of our services.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      7. Governing Law
                    </h3>
                    <p className="text-muted-foreground">
                      These terms are governed by the laws of the United States,
                      without regard to conflict of law provisions.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {activePolicySection === "privacy" && (
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
                      <li>
                        Send purchase confirmations and license agreements
                      </li>
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
                      We do NOT sell your personal information. We may share
                      data with:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>
                        Payment processors (PayPal) to complete transactions
                      </li>
                      <li>Email service providers for communications</li>
                      <li>Analytics services to improve our site</li>
                      <li>Law enforcement if legally required</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      Your Rights
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      You have the right to:
                    </p>
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
                      We implement industry-standard security measures to
                      protect your information. However, no method of
                      transmission over the internet is 100% secure.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {activePolicySection === "licensing" && (
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  3LIXIR MUSIC BEAT LICENSE AGREEMENT
                </h1>
                <p className="text-sm text-muted-foreground mb-8">
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
                  This Beat License Agreement ("Agreement") is a legally binding
                  agreement between{" "}
                  <strong className="text-foreground">3LIXIR Music</strong>{" "}
                  ("Licensor," "we," "us") and the individual or entity
                  purchasing or otherwise acquiring a license to a Beat
                  ("Licensee," "you"). This Agreement governs your use of any
                  Beat obtained through the 3LIXIR Music platform.
                </p>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      1. Grant of License
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Subject to full payment and compliance with this Agreement
                      and the 3LIXIR Music Terms of Service, Licensor grants
                      Licensee a{" "}
                      <strong className="text-foreground">
                        non-exclusive, non-transferable, non-sublicensable,
                        limited license
                      </strong>{" "}
                      to use the licensed Beat solely as incorporated into a new
                      musical composition ("Derivative Work").
                    </p>
                    <p className="text-muted-foreground">
                      This is a{" "}
                      <strong className="text-foreground">
                        license, not a sale
                      </strong>
                      . No ownership rights are transferred.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      2. Ownership
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Licensor retains{" "}
                      <strong className="text-foreground">
                        100% ownership
                      </strong>{" "}
                      of:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>The Beat</li>
                      <li>The master recording</li>
                      <li>The underlying musical composition</li>
                      <li>All copyrights and intellectual property rights</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Licensee owns only the original lyrics and original
                      performance elements added by Licensee, subject to
                      Licensor's retained rights in the Beat.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      3. Permitted Uses
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Unless otherwise stated in writing, Licensee may:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Record vocals over the Beat</li>
                      <li>
                        Release the Derivative Work on digital streaming
                        platforms
                      </li>
                      <li>Distribute the Derivative Work for sale</li>
                      <li>Perform the Derivative Work live</li>
                      <li>Use the Derivative Work in audio-visual projects</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      All permitted uses are subject to the royalty provisions
                      in Section 5.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      4. Prohibited Uses
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Licensee may NOT:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        Resell, sublicense, lease, or redistribute the Beat by
                        itself
                      </li>
                      <li>
                        Make the Beat available for download or reuse by third
                        parties
                      </li>
                      <li>Claim authorship or ownership of the Beat</li>
                      <li>
                        Register the Beat or Derivative Work with any content
                        identification, fingerprinting, or automated
                        monetization system (including YouTube Content ID){" "}
                        <strong className="text-foreground">
                          without prior written consent
                        </strong>
                      </li>
                      <li>
                        Use the Beat in a manner that is defamatory, unlawful,
                        or infringing
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      5. Royalty Rights and Tokens
                    </h3>

                    <h4 className="text-xl font-medium mb-3 mt-6">
                      5.1 Subscription Royalty Clearance
                    </h4>
                    <p className="text-muted-foreground">
                      If Licensee acquires a Beat while an active 3LIXIR Music
                      Subscription is in good standing, Licensor grants Licensee{" "}
                      <strong className="text-foreground">
                        royalty-free usage
                      </strong>{" "}
                      of that Beat for the Derivative Work, provided the
                      Derivative Work is{" "}
                      <strong className="text-foreground">
                        Published while the Subscription is active
                      </strong>
                      .
                    </p>

                    <h4 className="text-xl font-medium mb-3 mt-6">
                      5.2 Token Royalty Clearance
                    </h4>
                    <p className="text-muted-foreground mb-2">
                      If Licensee is not actively subscribed, Licensee may
                      obtain royalty clearance for a specific Beat by applying a{" "}
                      <strong className="text-foreground">Token</strong> to that
                      Beat. Tokens:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Apply on a per-Beat basis</li>
                      <li>Are non-refundable</li>
                      <li>
                        Satisfy the royalty clearance requirement only for the
                        specific Beat
                      </li>
                    </ul>

                    <h4 className="text-xl font-medium mb-3 mt-6">
                      5.3 Scope of Royalty Rights
                    </h4>
                    <p className="text-muted-foreground mb-2">
                      Royalty rights granted under this Agreement:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        Apply only to the licensed Beat and specific Derivative
                        Work
                      </li>
                      <li>Do not constitute a transfer of copyright</li>
                      <li>Do not grant exclusive rights</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      6. Publication Requirement
                    </h3>
                    <p className="text-muted-foreground">
                      Royalty clearance granted under a Subscription applies{" "}
                      <strong className="text-foreground">
                        only if the Derivative Work is Published during an
                        active Subscription term
                      </strong>
                      . If a Beat is licensed but not Published before
                      Subscription cancellation, additional royalty clearance
                      (via Token or resubscription) may be required.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      7. Credit
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Where commercially reasonable, Licensee agrees to credit
                      the Beat as:
                    </p>
                    <blockquote className="border-l-4 border-[hsl(var(--gold))] pl-4 italic text-muted-foreground mb-4">
                      "Produced by 3LIXIR Music"
                    </blockquote>
                    <p className="text-muted-foreground">
                      Failure to provide credit does not invalidate the license
                      but may constitute a breach.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      8. Exclusivity
                    </h3>
                    <p className="text-muted-foreground">
                      All licenses granted are{" "}
                      <strong className="text-foreground">non-exclusive</strong>{" "}
                      unless Licensor expressly grants exclusivity in a separate
                      written agreement signed by both parties.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      9. Warranties and Representations
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Licensee represents and warrants that:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        The Derivative Work will not infringe third-party rights
                      </li>
                      <li>Licensee will comply with all applicable laws</li>
                      <li>
                        Licensee has the authority to enter this Agreement
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Licensor makes no guarantees regarding commercial success
                      or fitness for a particular purpose.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      10. Term and Termination
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      This Agreement remains in effect unless terminated due to
                      material breach. Licensor may terminate this Agreement if
                      Licensee violates any term, including prohibited uses.
                    </p>
                    <p className="text-muted-foreground mb-2">
                      Upon termination:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>All rights granted immediately revert to Licensor</li>
                      <li>
                        Continued exploitation of the Derivative Work must cease
                        unless otherwise authorized
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      11. Limitation of Liability
                    </h3>
                    <p className="text-muted-foreground">
                      To the maximum extent permitted by law, Licensor shall not
                      be liable for indirect, incidental, or consequential
                      damages. Total liability shall not exceed the amount paid
                      by Licensee for the applicable Beat.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      12. Indemnification
                    </h3>
                    <p className="text-muted-foreground">
                      Licensee agrees to indemnify and hold harmless Licensor
                      from any claims, damages, or expenses arising from
                      Licensee's use of the Beat or breach of this Agreement.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      13. Governing Law and Dispute Resolution
                    </h3>
                    <p className="text-muted-foreground">
                      This Agreement is governed by the laws of the State of
                      California. Any disputes shall be resolved in accordance
                      with the dispute resolution provisions set forth in the
                      3LIXIR Music Terms of Service.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      14. Entire Agreement
                    </h3>
                    <p className="text-muted-foreground">
                      This Agreement, together with the Terms of Service,
                      constitutes the entire agreement between the parties
                      regarding the Beat and supersedes all prior agreements.
                    </p>
                  </section>

                  <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="text-muted-foreground font-semibold">
                      END OF LICENSE AGREEMENT
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activePolicySection === "refund" && (
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  3LIXIR MUSIC REFUND & CANCELLATION POLICY
                </h1>
                <p className="text-sm text-muted-foreground mb-8">
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
                  This Refund & Cancellation Policy explains how refunds, cancellations, and billing disputes are handled for purchases made through the 3LIXIR Music platform. This policy is incorporated by reference into the 3LIXIR Music Terms of Service and Beat License Agreement.
                </p>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      1. General Policy
                    </h3>
                    <p className="text-muted-foreground">
                      Due to the digital nature of our products and services, <strong className="text-foreground">all sales are final</strong>, except where refunds are required by applicable law. By purchasing or subscribing to any 3LIXIR Music product or service, you acknowledge and agree to this policy.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      2. Non-Refundable Items
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      The following are non-refundable:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Digital Beat purchases or licenses</li>
                      <li>Royalty clearance Tokens</li>
                      <li>Downloaded or accessed digital content</li>
                      <li>Subscription fees (partial or unused billing periods)</li>
                      <li>Production services once work has begun</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Once a Beat has been delivered, downloaded, accessed, or licensed, it is considered used and ineligible for refund.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      3. Subscriptions and Cancellations
                    </h3>

                    <h4 className="text-xl font-medium mb-3 mt-6">3.1 Subscription Billing</h4>
                    <p className="text-muted-foreground">
                      Subscriptions are billed on a recurring basis as disclosed at checkout.
                    </p>

                    <h4 className="text-xl font-medium mb-3 mt-6">3.2 Cancellation</h4>
                    <p className="text-muted-foreground mb-2">
                      You may cancel your Subscription at any time through your account dashboard or by contacting support. Cancellation:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Stops future billing</li>
                      <li>Does not refund the current billing period</li>
                      <li>Does not revoke rights properly granted under an active Subscription, as defined in the Terms of Service and License Agreement</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Access to Subscription-only features may terminate immediately upon cancellation or at the end of the billing cycle, depending on the plan.
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
                      <li>Are forfeited if unused</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Applying a Token permanently satisfies the royalty clearance requirement for the applicable Beat and cannot be reversed.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      5. Exceptional Circumstances
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Refunds may be considered solely at the discretion of 3LIXIR Music in limited circumstances, such as:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Duplicate charges due to technical error</li>
                      <li>Billing errors confirmed by our payment processor</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      No refunds will be issued for dissatisfaction, change of mind, lack of use, or misunderstanding of license terms.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      6. Chargebacks and Payment Disputes
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Initiating a chargeback or payment dispute without first contacting 3LIXIR Music may result in:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Immediate suspension or termination of your account</li>
                      <li>Revocation of access to the Services</li>
                      <li>Loss of any granted licenses or benefits</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      We reserve the right to dispute chargebacks and provide documentation to payment processors.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      7. Legal Compliance
                    </h3>
                    <p className="text-muted-foreground">
                      Nothing in this policy limits any rights you may have under applicable consumer protection laws that cannot be waived. If local law requires a refund, we will comply to the extent required.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      8. Changes to This Policy
                    </h3>
                    <p className="text-muted-foreground">
                      We reserve the right to update or modify this Refund & Cancellation Policy at any time. Changes become effective upon posting to the Platform.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      9. Contact Information
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      For billing questions or cancellation assistance, contact:
                    </p>
                    <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-2">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">3LIXIR Music</strong>
                      </p>
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Email:</strong> <span className="text-[hsl(var(--gold))]">contact@3lixirmusic.com</span>
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
            )}
            {activePolicySection === "faq" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Last Updated: January 2026
                  </p>
                </div>

                <div className="space-y-6">
                  {/* General Questions */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[hsl(var(--gold))]">
                      General Questions
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          How do I purchase a beat?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          Browse our catalog, select your beat, choose a license
                          tier, and complete checkout via PayPal. You'll receive
                          instant download access.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          What file formats do you provide?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          Basic licenses include MP3. Premium and Exclusive
                          licenses include WAV files and/or trackout stems.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          What's the difference between Basic and Premium?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          Premium offers higher usage limits, tag-free versions,
                          and higher quality files (WAV/trackouts).
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          Can multiple artists buy the same beat?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          Yes, unless someone purchases an Exclusive License,
                          which removes the beat from our store.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Refunds */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[hsl(var(--gold))]">
                      Payment & Refunds
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          What payment methods do you accept?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          Currently PayPal, with Cash App coming soon.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          Do you offer refunds?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          Due to the digital nature of our products, all sales
                          are final. Please review carefully before purchase.
                          See our Refund Policy for exceptions.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Licensing & Usage */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[hsl(var(--gold))]">
                      Licensing & Usage
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          Do I own the beat after purchasing?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          You own the right to USE the beat according to your
                          license terms. 3LIXIR MUSIC retains copyright
                          ownership unless you purchase an Exclusive License.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          Can I use the beat on Spotify, Apple Music, etc.?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          Yes, within your license tier's distribution limits.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          What happens if I exceed my license limits?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          You must upgrade to the next tier. Contact us to
                          discuss your options.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Support */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[hsl(var(--gold))]">
                      Technical Support
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          I didn't receive my download link. What do I do?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          Check your spam folder first. If you still can't find
                          it, contact us at contact@3lixirmusic.com with your
                          order number.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Still Have Questions */}
                  <div className="bg-gradient-to-r from-[hsl(var(--gold))]/10 to-transparent border border-[hsl(var(--gold))]/20 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      Still have questions?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Can't find the answer you're looking for? Our support team
                      is here to help.
                    </p>
                    <a
                      href="mailto:contact@3lixirmusic.com"
                      className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] text-black px-6 py-2.5 rounded-full font-semibold hover:bg-[hsl(var(--gold))]/90 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            )}
    {activePolicySection === "copyright" && (
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
          3LIXIR MUSIC DMCA COPYRIGHT INFRINGEMENT POLICY
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last Updated: January 2026
        </p>

        <p className="text-muted-foreground mb-8">
          3LIXIR Music respects the intellectual property rights of others and expects users of our services to do the same. This Digital Millennium Copyright Act ("DMCA") Copyright Infringement Policy outlines our procedures for responding to claims of copyright infringement in compliance with the DMCA (17 U.S.C. § 512).
        </p>

        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              1. Designated DMCA Agent
            </h3>
            <p className="text-muted-foreground mb-4">
              Pursuant to the DMCA, 3LIXIR Music has designated the following agent to receive notifications of claimed infringement:
            </p>
            <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-2">
              <p className="text-muted-foreground">
                <strong className="text-foreground">DMCA Agent:</strong> 3LIXIR Music
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Email:</strong> <span className="text-[hsl(var(--gold))]">dmca@3lixirmusic.com</span>
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Address:</strong> [Business Address]
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              2. Filing a DMCA Takedown Notice
            </h3>
            <p className="text-muted-foreground mb-4">
              If you believe that your copyrighted work has been copied or used in a way that constitutes copyright infringement, you may submit a written notification to our DMCA Agent that includes all of the following:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
              <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
              <li>Identification of the copyrighted work claimed to have been infringed</li>
              <li>Identification of the infringing material and information reasonably sufficient to permit us to locate the material</li>
              <li>Your contact information, including name, address, telephone number, and email address</li>
              <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law</li>
              <li>A statement, under penalty of perjury, that the information in the notification is accurate and that you are authorized to act on behalf of the copyright owner</li>
            </ol>
            <p className="text-muted-foreground mt-4 italic">
              Incomplete notices may not be processed.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              3. Our Response to Valid Notices
            </h3>
            <p className="text-muted-foreground mb-2">
              Upon receipt of a valid DMCA takedown notice, 3LIXIR Music may:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Remove or disable access to the allegedly infringing material</li>
              <li>Notify the affected user of the takedown</li>
              <li>Take additional action consistent with applicable law</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to remove content at our sole discretion.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              4. Counter-Notification Procedure
            </h3>
            <p className="text-muted-foreground mb-4">
              If you believe that material removed or disabled pursuant to a DMCA notice was removed due to mistake or misidentification, you may submit a counter-notification that includes:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
              <li>Your physical or electronic signature</li>
              <li>Identification of the material that has been removed and its prior location</li>
              <li>A statement under penalty of perjury that you have a good faith belief the material was removed due to mistake or misidentification</li>
              <li>Your name, address, telephone number, and email address</li>
              <li>A statement consenting to the jurisdiction of the federal court located in your judicial district (or California if outside the United States)</li>
            </ol>
            <p className="text-muted-foreground mt-4">
              Counter-notifications should be sent to the DMCA Agent listed above.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              5. Repeat Infringer Policy
            </h3>
            <p className="text-muted-foreground">
              In accordance with the DMCA, 3LIXIR Music maintains a policy to terminate, in appropriate circumstances and at our sole discretion, users who are deemed to be repeat infringers.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              6. Misrepresentations
            </h3>
            <p className="text-muted-foreground">
              Any person who knowingly materially misrepresents that material or activity is infringing, or that material was removed or disabled by mistake or misidentification, may be subject to liability under 17 U.S.C. § 512(f).
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              7. No Legal Advice
            </h3>
            <p className="text-muted-foreground">
              This DMCA Policy is provided for informational purposes only and does not constitute legal advice. We encourage copyright owners and users to consult legal counsel before submitting a notice or counter-notice.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
              8. Changes to This Policy
            </h3>
            <p className="text-muted-foreground">
              We reserve the right to update this DMCA Policy at any time. Changes become effective upon posting.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-muted-foreground font-semibold">
              END OF DMCA COPYRIGHT POLICY
            </p>
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

        <div className="w-full">
          {/* Horizontal Navigation */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max justify-center">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all whitespace-nowrap ${
                      activeSection === section.id
                        ? "bg-[hsl(var(--gold))] text-black font-semibold shadow-lg shadow-[hsl(var(--gold))]/20"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* White Separator Line */}
          <div className="w-full h-px bg-white/20 mb-8"></div>

          {/* Content Area - Full width */}
          <div className="border border-white/10 rounded-2xl p-8 md:p-12 bg-white/5 backdrop-blur-sm">
            {content[activeSection]}
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
