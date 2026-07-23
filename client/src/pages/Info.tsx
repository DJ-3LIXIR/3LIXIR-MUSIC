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
  Sparkles, // Add these
  Headphones, // Add these
  Zap, // Add these
  CheckCircle, // Add these
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Background } from "@/components/layout/Background";
import { SupportArtist } from "@/components/Info/SupportArtist";
import MeetTheArtistBanner from "@/components/Info/MeetTheArtistBanner";
import { TechnicalSupport } from "@/components/Info/TechnicalSupport";
import { SocialMedia } from "@/components/Info/SocialMedia";
import { CustomerServiceInfo } from "@/components/Info/CustomerServiceInfo";

const InfoPage = () => {
  const [activeSection, setActiveSection] = useState("about");
  const [activePolicySection, setActivePolicySection] = useState("terms");
  const [activeAboutSection, setActiveAboutSection] = useState("story");
  const [activeArtistSection, setActiveArtistSection] = useState("dj3lixir");
  const [location] = useLocation();

  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const section = searchParams.get("section");
      const hash = window.location.hash.slice(1); // Get hash without the #

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

          // Handle About subsections
          if (section === "about" && hash) {
            setActiveAboutSection(hash); // e.g., "story", "mission", "offer"
          } else if (section === "about") {
            setActiveAboutSection("story"); // Default to story
          }

          // Handle Artist subsections
          if (section === "artist" && hash) {
            setActiveArtistSection(hash); // e.g., "dj3lixir", "future"
          } else if (section === "artist") {
            setActiveArtistSection("dj3lixir"); // Default to dj3lixir
          }
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
    };

    // Run on mount and when location changes
    handleUrlChange();

    // Listen for URL changes from navbar (popstate events)
    window.addEventListener("popstate", handleUrlChange);

    return () => window.removeEventListener("popstate", handleUrlChange);
  }, [location]); // This dependency ensures it runs when the URL changes
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
                    src="/3LIXIR_logo.png"
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
                  3LIXIR MUSIC – TERMS OF SERVICE
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
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
                      By accessing, browsing, purchasing Beats, subscribing to
                      any plan, downloading content, or otherwise using the
                      Services, you acknowledge that you have read, understood,
                      and agree to be bound by these Terms.
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
                        Frazier, an individual, and any future affiliated
                        entity.
                      </li>
                      <li>
                        <strong className="text-foreground">"Platform"</strong>{" "}
                        means the 3LIXIR MUSIC website, storefront, user
                        dashboards, subscription systems, and digital delivery
                        infrastructure.
                      </li>
                      <li>
                        <strong className="text-foreground">"User"</strong>{" "}
                        means any individual or entity accessing or using the
                        Services.
                      </li>
                      <li>
                        <strong className="text-foreground">"Beat(s)"</strong>{" "}
                        means musical compositions, instrumentals, or audio
                        works made available through the Platform.
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
                        non-sublicensable right to use a Beat as expressly
                        granted under these Terms and the applicable License
                        Agreement.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          "Royalty Token"
                        </strong>{" "}
                        or{" "}
                        <strong className="text-foreground">
                          "Black License"
                        </strong>{" "}
                        means a per-Beat paid license priced at $50 USD,
                        granting royalty usage rights under a 40% (User) / 60%
                        (3LIXIR) royalty split.
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
                        means the contractual right to commercially exploit a
                        Beat and collect royalties according to the applicable
                        royalty split, subject to compliance with these Terms.
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
                      3LIXIR MUSIC may modify, suspend, or discontinue any
                      aspect of the Services at any time.
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
                            Royalty Rights are retained for the life of the
                            song, provided the Beat was properly licensed and
                            Published
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
                          Subscription benefits apply only while the
                          subscription is active.
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
                      All Beats remain the exclusive property of their
                      respective copyright owners.
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
                      <li>
                        Royalty Tokens and Subscriptions are non-refundable
                      </li>
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
                      claims arising from your use of the Services or violation
                      of these Terms.
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
                      All disputes shall be resolved by binding arbitration on
                      an individual basis, except where injunctive relief is
                      sought.
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
                      Each Beat is also governed by a License Agreement
                      presented at checkout.
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
                      Nothing in these Terms waives non-waivable consumer
                      rights.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      21. Changes to Terms
                    </h3>
                    <p className="text-muted-foreground">
                      Terms may be updated at any time. Continued use
                      constitutes acceptance.
                    </p>
                  </section>

                  <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="text-muted-foreground font-semibold">
                      END OF TERMS OF SERVICE
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activePolicySection === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  3LIXIR MUSIC PRIVACY POLICY
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
                  This Privacy Policy describes how{" "}
                  <strong className="text-foreground">3LIXIR MUSIC</strong>{" "}
                  ("we," "us") collects, uses, discloses, and protects personal
                  information when you access or use our website, platform,
                  subscriptions, digital products, Beats, and related services
                  (collectively, the "Services").
                </p>
                <p className="text-muted-foreground mb-8">
                  This Privacy Policy is incorporated by reference into the
                  3LIXIR MUSIC Terms of Service.
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
                      services are processed by third-party payment processors
                      in accordance with their own privacy policies.
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
                        Communicate service-related notices, updates, and
                        support messages
                      </li>
                      <li>
                        Enforce our Terms of Service and License Agreements
                      </li>
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
                      We do <strong className="text-foreground">not</strong>{" "}
                      sell personal information.
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
                      your information may be transferred to and processed in
                      the United States, where data protection laws may differ
                      from those in your jurisdiction.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      10. Children's Privacy
                    </h3>
                    <p className="text-muted-foreground">
                      The Services are not intended for individuals under the
                      age of eighteen (18). We do not knowingly collect personal
                      information from children.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      11. Third-Party Links and Services
                    </h3>
                    <p className="text-muted-foreground">
                      The Services may contain links to or integrations with
                      third-party services. We are not responsible for the
                      privacy practices or content of third parties.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      12. Changes to This Privacy Policy
                    </h3>
                    <p className="text-muted-foreground">
                      We may update this Privacy Policy from time to time.
                      Updates become effective upon posting. Continued use of
                      the Services constitutes acceptance of the revised Privacy
                      Policy.
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
                        <strong className="text-foreground">
                          3LIXIR MUSIC
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
                      END OF PRIVACY POLICY
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activePolicySection === "licensing" && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  3LIXIR MUSIC BEAT LICENSE AGREEMENT
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
                  This Beat License Agreement ("Agreement") is a legally binding
                  agreement between{" "}
                  <strong className="text-foreground">3LIXIR MUSIC</strong>{" "}
                  ("Licensor," "we," "us") and the individual or entity
                  purchasing or otherwise acquiring a license to a Beat
                  ("Licensee," "you"). This Agreement governs your use of any
                  Beat obtained through the 3LIXIR MUSIC platform and is
                  incorporated by reference into the 3LIXIR MUSIC Terms of
                  Service ("TOS").
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
                        Resell, sublicense, lease, or redistribute the Beat
                        alone
                      </li>
                      <li>
                        Make the Beat available for download, reuse, or
                        extraction
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
                        Use the Beat in unlawful, defamatory, or infringing
                        works
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
                      Subscription is active and in good standing, Licensor
                      grants{" "}
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
                      applicable splits. Failure to comply constitutes a
                      material breach.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      7. Publication Requirement
                    </h3>
                    <p className="text-muted-foreground">
                      If a Beat is licensed during a Subscription but not
                      Published before Subscription cancellation or expiration,
                      royalty clearance is not preserved, and additional
                      clearance (Royalty Token or re-subscription) is required
                      prior to Publication.
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
                      Licensor may terminate this Agreement upon material
                      breach, including:
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
                      <li>
                        All licensed rights immediately revert to Licensor
                      </li>
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
                      Licensor's total liability shall not exceed the service
                      fees paid by Licensee for the applicable Beat.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      13. Indemnification
                    </h3>
                    <p className="text-muted-foreground">
                      Licensee agrees to indemnify and hold harmless Licensor
                      from claims arising from Licensee's use of the Beat or
                      breach of this Agreement.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      14. Governing Law
                    </h3>
                    <p className="text-muted-foreground">
                      This Agreement is governed by the laws of the State of
                      California and subject to the dispute resolution
                      provisions in the Terms of Service.
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
            )}

            {activePolicySection === "refund" && (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  3LIXIR MUSIC REFUND & CANCELLATION POLICY
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
                  This Refund & Cancellation Policy explains how refunds,
                  cancellations, billing disputes, and payment-related issues
                  are handled for purchases made through the 3LIXIR MUSIC
                  platform ("Platform").
                </p>
                <p className="text-muted-foreground mb-8">
                  This Policy is incorporated by reference into the 3LIXIR MUSIC
                  Terms of Service, Beat License Agreement, and Return Policy.
                </p>
                <p className="text-muted-foreground mb-8">
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
                      , except where refunds are expressly required by
                      applicable law.
                    </p>
                    <p className="text-muted-foreground">
                      By purchasing, subscribing to, or using any 3LIXIR MUSIC
                      product or Service, you acknowledge and agree to this
                      Refund & Cancellation Policy.
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
                      Once a Beat or digital product has been delivered,
                      accessed, downloaded, licensed, or used for clearance, it
                      is considered consumed and ineligible for refund.
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
                        occurred during an active Subscription, as defined in
                        the Terms of Service
                      </li>
                      <li>
                        Does not revoke rights properly granted during an active
                        Subscription term
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Access to Subscription-only features may terminate
                      immediately or at the end of the billing cycle, depending
                      on the plan.
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
                      Refunds may be considered solely at the discretion of
                      3LIXIR MUSIC in limited circumstances, including:
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
                      corrected access, or replacement—not necessarily a
                      monetary refund.
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
                      <li>
                        Immediate suspension or termination of your account
                      </li>
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
                      supporting documentation to payment processors and
                      financial institutions.
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
                      We may update or modify this Refund & Cancellation Policy
                      at any time. Changes become effective upon posting to the
                      Platform. Continued use constitutes acceptance of the
                      revised Policy.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      11. Contact Information
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      For billing questions, disputes, or cancellation
                      assistance, contact:
                    </p>
                    <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-2">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">
                          3LIXIR MUSIC
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
                          What am I paying for?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          you are paying for creative labor and licensing. Your
                          payment covers: The labor involved in creating and
                          preparing the beat (by DJ 3LIXIR and/or hosted
                          artists) Platform services (hosting, delivery, and
                          rights administration) A limited license to use the
                          beat under the 3LIXIR MUSIC license terms You are not
                          buying ownership of the beat, copyright, or exclusive
                          rights.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          What file formats do you provide?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          All Licenses come with WAV files for that lossless
                          audio quality.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          Why Subscribe to a VIP License?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          Subscribing gives you ongoing access to beats and
                          built-in royalty clearance, so you can release music
                          without paying per-beat licensing fees as long as your
                          subscription is active. It’s the most cost-effective
                          way to consistently create and publish music using
                          3LIXIR beats.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          Can multiple artists buy the same beat?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          Yes, unless someone purchases an Exclusive License,
                          which removes the beat from our store. You can contact
                          us for exclusive licensing.
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
                          Currently PayPal, Stripe, Crypto with Coinbase coming
                          soon.
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
                          Yes, within your license tier it allows you access to
                          collect royalties on a song you have made using an
                          instrumental.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-5">
                        <h4 className="font-semibold mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          What happens if I cancel my license?
                        </h4>
                        <p className="text-muted-foreground pl-7">
                          This only applies to VIP Licenses. If you cancel your
                          subcription than any beat you own that you hhave not
                          published will require a token to publish upon
                          cancellation, so make sure to publish your music
                          before cancellation.
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
                          it, contact us at support@3lixirmusic.com with your
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
                      href="mailto:support@3lixirmusic.com"
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
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  3LIXIR MUSIC DMCA COPYRIGHT INFRINGEMENT POLICY
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
                  3LIXIR MUSIC respects the intellectual property rights of
                  others and expects users of the Services to do the same. This
                  Digital Millennium Copyright Act ("DMCA") Copyright
                  Infringement Policy explains the procedures followed by 3LIXIR
                  MUSIC in response to claims of copyright infringement under
                  the DMCA (17 U.S.C. § 512).
                </p>
                <p className="text-muted-foreground mb-8">
                  This Policy applies to all content made available through the
                  3LIXIR MUSIC platform, including but not limited to DJ 3LIXIR
                  Beats, third-party licensed Beats, user-submitted materials
                  (if applicable), and related Services.
                </p>
                <p className="text-muted-foreground mb-8">
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
                      If you believe that material available through the
                      Services infringes a copyright you own or control, you may
                      submit a written DMCA takedown notice that includes all of
                      the following:
                    </p>
                    <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
                      <li>
                        A physical or electronic signature of the copyright
                        owner or a person authorized to act on their behalf
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
                        A statement that you have a good-faith belief that the
                        use of the material is not authorized by the copyright
                        owner, its agent, or the law
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
                      If you believe that material removed or disabled pursuant
                      to a DMCA notice was removed due to mistake or
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
                        good-faith belief the material was removed or disabled
                        due to mistake or misidentification
                      </li>
                      <li>
                        Your name, address, telephone number, and email address
                      </li>
                      <li>
                        A statement consenting to the jurisdiction of the
                        federal district court in your judicial district, or the
                        State of California if you reside outside the United
                        States
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
                      In accordance with the DMCA, 3LIXIR MUSIC maintains a
                      policy of terminating, in appropriate circumstances and at
                      its sole discretion, users who are determined to be repeat
                      copyright infringers.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      6. Misrepresentations
                    </h3>
                    <p className="text-muted-foreground">
                      Any person who knowingly materially misrepresents that
                      material or activity is infringing, or that material was
                      removed or disabled by mistake or misidentification, may
                      be subject to liability under 17 U.S.C. § 512(f).
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
                      Beats licensed through 3LIXIR MUSIC are governed
                      exclusively by the applicable Terms of Service and Beat
                      License Agreement. Improper DMCA submissions based on
                      licensing misunderstandings may be rejected.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      8. No Legal Advice
                    </h3>
                    <p className="text-muted-foreground">
                      This DMCA Policy is provided for informational purposes
                      only and does not constitute legal advice. We encourage
                      copyright owners and users to consult qualified legal
                      counsel before submitting a takedown notice or
                      counter-notification.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      9. Changes to This Policy
                    </h3>
                    <p className="text-muted-foreground">
                      We reserve the right to update or modify this DMCA Policy
                      at any time. Changes become effective upon posting to the
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
            )}
          </div>
        </div>
      </div>
    ),

    contact: (
      <div className="space-y-12">
        {/* Contact Section */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6 text-center">
            Contact Us
          </h2>
          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-display font-semibold tracking-tight mb-3 text-center">
                Get In Touch
              </h3>
              <p className="text-muted-foreground mb-6 text-center">
                Have questions, need support, or want to discuss custom work?
                We're here to help.
              </p>
              <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-4">
                <div className="w-fit mx-auto space-y-4">
                  <div className="grid grid-cols-[28px_auto] items-start gap-3">
                    <Mail className="w-5 h-5 text-[hsl(var(--gold))] mt-1" />
                    <div className="text-center">
                      <p className="font-semibold">Email</p>
                      <p className="text-muted-foreground">
                        support@3lixirmusic.com
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[28px_auto] items-start gap-3">
                    <Phone className="w-5 h-5 text-[hsl(var(--gold))] mt-1" />
                    <div className="text-center">
                      <p className="font-semibold">949 308 5144</p>
                      <p className="text-muted-foreground mt-2">
                        Text or call for website issues only
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 mt-4">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Communication Preference:</strong> Please initiate all business inquiries via text. Phone calls are reserved for website issues or urgent matters only.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Customer Service Section */}
        <CustomerServiceInfo />

        {/* Production Opportunities Section */}
        <div className="border-t border-white/10 pt-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6 text-center">
              Production Opportunities
            </h2>

            <div className="space-y-8">
              {/* Intro Section */}
              <section className="max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed text-muted-foreground text-center">
                  DJ 3LIXIR offers custom production services designed to bring
                  your musical vision to life. Whether you need a beat tailored
                  to your unique style, full instrumental composition, or
                  collaborative production work, we provide hands-on,
                  artist-focused solutions that go beyond the catalog.
                </p>
              </section>

              {/* Services Grid */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {/* Custom Beat Production */}
                <div className="border border-white/10 rounded-xl p-6 bg-gradient-to-br from-[hsl(var(--gold))]/10 to-transparent hover:border-[hsl(var(--gold))]/30 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                      <Music className="w-6 h-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                        Custom Beat Production
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Get a beat made specifically for you. Describe your
                        vision, share references, and receive a professionally
                        produced instrumental crafted to match your artistic
                        direction.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Tailored to your style and genre
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Unlimited revisions until satisfied
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Full stems and project files included
                    </li>
                  </ul>
                </div>

                {/* Full Production Services */}
                <div className="border border-white/10 rounded-xl p-6 bg-gradient-to-br from-[hsl(var(--gold))]/10 to-transparent hover:border-[hsl(var(--gold))]/30 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                      <Sparkles className="w-6 h-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                        Full Production Services
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        From concept to completion. Comprehensive production
                        including composition, arrangement, mixing, and
                        mastering. Perfect for artists working on albums, EPs,
                        or flagship singles.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      End-to-end production workflow
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Professional mixing and mastering
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Industry-standard quality output
                    </li>
                  </ul>
                </div>

                {/* Collaboration & Co-Production */}
                <div className="border border-white/10 rounded-xl p-6 bg-gradient-to-br from-[hsl(var(--gold))]/10 to-transparent hover:border-[hsl(var(--gold))]/30 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                      <Headphones className="w-6 h-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                        Collaboration & Co-Production
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Work side-by-side with DJ 3LIXIR to develop your sound.
                        Collaborative sessions where your ideas meet
                        professional execution, perfect for artists who want
                        creative input throughout the process.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Real-time creative collaboration
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Flexible workflow to match your process
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Shared creative ownership options
                    </li>
                  </ul>
                </div>

                {/* Remix & Rework Services */}
                <div className="border border-white/10 rounded-xl p-6 bg-gradient-to-br from-[hsl(var(--gold))]/10 to-transparent hover:border-[hsl(var(--gold))]/30 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-[hsl(var(--gold))]/20 rounded-lg">
                      <Zap className="w-6 h-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold tracking-tight mb-2">
                        Remix & Rework Services
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Breathe new life into existing tracks. Transform your
                        music with fresh production, updated arrangements, or
                        complete genre reimagining while maintaining the core
                        essence of your work.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Genre transformation and crossover
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Modernization of older tracks
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                      Alternative versions for releases
                    </li>
                  </ul>
                </div>
              </div>

              {/* Process Section */}
              <section className="mt-12">
                <h3 className="text-2xl font-display font-semibold tracking-tight mb-6 text-center">
                  How It Works
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-[hsl(var(--gold))]">
                        1
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">Consultation</h4>
                    <p className="text-sm text-muted-foreground">
                      Discuss your vision, goals, and creative direction
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-[hsl(var(--gold))]">
                        2
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">Production</h4>
                    <p className="text-sm text-muted-foreground">
                      DJ 3LIXIR creates your custom track with precision
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-[hsl(var(--gold))]">
                        3
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">Revision</h4>
                    <p className="text-sm text-muted-foreground">
                      Refine and adjust until it matches your vision
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-[hsl(var(--gold))]">
                        4
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">Delivery</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive your completed track with all files and rights
                    </p>
                  </div>
                </div>
              </section>

              {/* Why Choose Section */}
              <section className="mt-12 border border-white/10 rounded-xl p-8 bg-white/5 max-w-3xl mx-auto">
                <h3 className="text-2xl font-display font-semibold tracking-tight mb-4">
                  Why Work With DJ 3LIXIR?
                </h3>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">
                      Multi-Genre Expertise:
                    </strong>{" "}
                    From EDM to Hip Hop, Lo-Fi to House, experience across
                    diverse styles means your sound gets the attention it
                    deserves.
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">
                      Artist-First Mindset:
                    </strong>{" "}
                    This isn't factory production. Every project is treated as a
                    unique creative endeavor with your success as the priority.
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">
                      Real Instrumentation:
                    </strong>{" "}
                    Live piano and saxophone integration available for
                    authentic, organic textures that set your music apart.
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">
                      Clear Rights Management:
                    </strong>{" "}
                    No confusion, no hidden clauses. You know exactly what you
                    own and what you can do with it.
                  </p>
                </div>
              </section>

              {/* CTA Section */}
              <section className="mt-12 bg-gradient-to-r from-[hsl(var(--gold))]/10 to-transparent border border-[hsl(var(--gold))]/20 rounded-xl p-8 text-center max-w-3xl mx-auto">
                <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                  Ready to Create Something Unique?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Whether you have a clear vision or just a spark of an idea,
                  let's talk about how we can bring your music to life. Custom
                  production starts with a conversation.
                </p>
                <a
                  href="mailto:support@3lixirmusic.com?subject=Custom Production Inquiry"
                  className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] text-black px-8 py-3 rounded-full font-semibold hover:bg-[hsl(var(--gold))]/90 transition-colors"
                >
                  <Music className="w-5 h-5" />
                  Get In Touch
                </a>
              </section>
            </div>
          </div>
          <TechnicalSupport />
        </div>

        {/* Add Social Media Section Here */}
        <div className="border-t border-white/10 pt-12">
          <SocialMedia />
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />
      {/* Textured Background - Same as BeatsLanding */}
      <div className="fixed inset-0 z-0">
        {/* Left Side */}
        <div
          className="absolute top-0 left-0 bottom-0 w-1/2"
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
          }}
        />
        {/* Right Side - Mirrored */}
        <div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
            transform: "scaleX(-1)",
          }}
        />
      </div>
      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Information Center
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                          ? "bg-yellow-600 text-black font-semibold shadow-lg"
                          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
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
            {/* Content Area */}
            <div className="border border-white/10 rounded-2xl p-8 md:p-12 bg-white/5 backdrop-blur-sm">
              {content[activeSection]}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="border-t border-white/10 mt-20">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center text-gray-400">
              <p>© 2026 3LIXIR MUSIC. All rights reserved.</p>
              <p className="text-sm mt-2">
                Questions? Contact us at{" "}
                <span className="text-yellow-600">support@3lixirmusic.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
