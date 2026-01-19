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
                  3LIXIR MUSIC TERMS OF SERVICE
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
                  These Terms of Service ("Terms") govern your access to and use
                  of the 3LIXIR MUSIC website, platform, products,
                  subscriptions, digital downloads, and related services
                  (collectively, the "Services"). By accessing or using the
                  Services, you agree to be bound by these Terms.
                </p>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      1. Acceptance of Terms
                    </h3>
                    <p className="text-muted-foreground">
                      By accessing, browsing, registering for an account,
                      purchasing Beats, subscribing to any plan, or downloading
                      any content from the Services, you acknowledge that you
                      have read, understood, and agree to be bound by these
                      Terms. If you do not agree, you must not use the Services.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      We may update these Terms from time to time. Continued use
                      of the Services after changes become effective constitutes
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
                          "3LIXIR MUSIC (unofficial LLC)"
                        </strong>{" "}
                        means 3LIXIR MUSIC, operating as an unofficial limited
                        liability company, including its licensors.
                      </li>
                      <li>
                        <strong className="text-foreground">"Platform"</strong>{" "}
                        means the 3LIXIR MUSIC website, user dashboards,
                        subscription systems, and digital delivery
                        infrastructure.
                      </li>
                      <li>
                        <strong className="text-foreground">"User"</strong>{" "}
                        means any individual or entity accessing or using the
                        Services.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          "3LIXIR Beat(s)"
                        </strong>{" "}
                        means musical compositions, instrumentals, or audio
                        works made available through the Platform.{" "}
                        <strong className="text-foreground">
                          "DJ 3LIXIR Beat(s)"
                        </strong>{" "}
                        means 3LIXIR Beats that are produced by DJ 3LIXIR.
                      </li>
                      <li>
                        <strong className="text-foreground">"License"</strong>{" "}
                        means the limited, non-exclusive, non-transferable right
                        to use a Beat as expressly granted under these Terms or
                        a separate license agreement.
                      </li>
                      <li>
                        <strong className="text-foreground">"Token"</strong>{" "}
                        means a royalty clearance token that satisfies the
                        royalty fee requirement for a specific Beat.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          "Subscription"
                        </strong>{" "}
                        means a recurring paid plan providing access to certain
                        benefits while active.
                      </li>
                      <li>
                        <strong className="text-foreground">"Published"</strong>{" "}
                        means publicly released or distributed to the public via
                        streaming platforms, digital stores, broadcast, or other
                        public-facing distribution channels.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          "Royalty Rights"
                        </strong>{" "}
                        means the right to commercially exploit a Beat without
                        additional royalty payment obligations, subject to the
                        limitations of the applicable License.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      3. Eligibility and Accounts
                    </h3>
                    <p className="text-muted-foreground">
                      You must be at least eighteen (18) years old to use the
                      Services. By using the Services, you represent that you
                      meet this requirement.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      You are responsible for maintaining the confidentiality of
                      your account credentials and for all activity conducted
                      through your account. You agree to provide accurate and
                      complete information and to keep your account information
                      up to date.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      4. Description of Services
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      3LIXIR MUSIC (unofficial LLC) provides digital
                      music-related services, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Licensing of DJ 3LIXIR Beats</li>
                      <li>Subscription-based access and benefits</li>
                      <li>Token-based royalty clearance</li>
                      <li>Music production and rights-related services</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      3LIXIR MUSIC (unofficial LLC) reserves the right to
                      modify, suspend, or discontinue any aspect of the Services
                      at any time without notice.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      5. Subscriptions
                    </h3>
                    <p className="text-muted-foreground">
                      Subscriptions are billed on a recurring basis as disclosed
                      at the time of purchase. Subscription benefits apply only
                      while the Subscription is active and in good standing.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Subscriptions do not grant ownership of any Beat or
                      intellectual property. Subscription pricing, features, and
                      benefits may change at any time. Cancellation of a
                      Subscription stops future billing but does not
                      retroactively revoke rights properly granted while the
                      Subscription was active, subject to these Terms.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      6. Tokens and Royalty Clearance
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Certain Beats require the use of a Token to satisfy the
                      royalty clearance fee. Tokens:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Apply on a per-Beat basis</li>
                      <li>Are non-refundable</li>
                      <li>Do not transfer ownership of any copyright</li>
                      <li>
                        Remove only the royalty clearance requirement for the
                        applicable Beat
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Tokens have no cash value and may not be resold,
                      transferred, or exchanged.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      7. Beat Licensing and Usage Rights
                    </h3>
                    <p className="text-muted-foreground">
                      All 3LIXIR Beats are licensed through the Platform.
                      Ownership of 3LIXIR Beats remains with their respective
                      owners unless expressly stated otherwise. All DJ 3LIXIR
                      Beats are owned exclusively by 3LIXIR MUSIC (unofficial
                      LLC).
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Users are granted a limited, non-exclusive,
                      non-transferable, and non-sublicensable License to use
                      3LIXIR Beats solely as permitted under the applicable
                      license terms. Ownership of any Beat, master recording,
                      and underlying composition does not transfer to the User.
                    </p>
                    <p className="text-muted-foreground mt-2 mb-2">
                      Unless expressly authorized in writing, Users may not:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        Resell, sublicense, share, or redistribute 3LIXIR Beats
                        in isolation or as part of any competing product
                      </li>
                      <li>Claim authorship or ownership of any Beat</li>
                      <li>
                        Register Beats or derivative works with any content
                        identification, fingerprinting, or monetization system
                        (including Content ID) without prior written consent
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Any use outside the scope of the granted License
                      constitutes a material breach of these Terms and may
                      result in immediate termination and legal action.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      8. Cancellation and Post-Cancellation Rights
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      If you cancel your Subscription:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        You retain Royalty Rights for Beats that were properly
                        purchased, cleared, and Published while your
                        Subscription was active
                      </li>
                      <li>
                        New Beat purchases after cancellation require Token
                        payment unless you resubscribe
                      </li>
                      <li>
                        Access to Subscription-only features may terminate
                        immediately
                      </li>
                      <li>
                        Unpublished Beats at the time of cancellation are not
                        guaranteed royalty clearance without Token payment
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      9. Payments, Refunds, and Chargebacks
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      <strong className="text-foreground">Service Fees.</strong>{" "}
                      All fees paid to 3LIXIR MUSIC (unofficial LLC) are service
                      fees for the production, preparation, and delivery of DJ
                      3LIXIR Beats, and for the grant of a limited license to
                      use such Beats. No fee constitutes a sale, assignment, or
                      transfer of any copyright, master, publishing, or
                      ownership interest.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      All payments are processed through third-party payment
                      providers. Prices are subject to change without notice.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      All sales of digital goods, Subscriptions, service fees,
                      and Tokens are final except where required by law.
                      Chargebacks or payment disputes may result in suspension
                      or termination of your account.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      You are responsible for all applicable taxes.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      10. User Conduct
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      You agree not to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        Use the Services for illegal or infringing purposes
                      </li>
                      <li>Violate intellectual property rights</li>
                      <li>Abuse, exploit, or reverse engineer the Platform</li>
                      <li>Misrepresent ownership or rights</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      3LIXIR MUSIC (unofficial LLC) reserves the right to
                      investigate violations and take appropriate action,
                      including suspension or termination.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      11. Intellectual Property
                    </h3>
                    <p className="text-muted-foreground">
                      All content, branding, trademarks, and software on the
                      Platform are the exclusive property of 3LIXIR MUSIC
                      (unofficial LLC) or its licensors. No rights are granted
                      except as expressly stated.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      12. Third-Party Services and Third-Party Beats
                    </h3>
                    <p className="text-muted-foreground">
                      The Services may integrate with third-party platforms and
                      may make available Beats that are owned by third-party
                      artists, producers, or rights holders ("Third-Party
                      Beats"). 3LIXIR MUSIC (unofficial LLC) licenses such
                      Third-Party Beats on behalf of the applicable rights
                      holders where authorized.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      3LIXIR MUSIC (unofficial LLC) does not claim ownership of
                      Third-Party Beats and is not responsible for the
                      underlying ownership, accuracy of rights claims, or
                      disputes arising from Third-Party Beats beyond the scope
                      of the license granted through the Platform. Rights to
                      Third-Party Beats remain with their respective owners.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      13. Disclaimers
                    </h3>
                    <p className="text-muted-foreground">
                      The Services are provided on an "AS IS" and "AS AVAILABLE"
                      basis without warranties of any kind. 3LIXIR MUSIC
                      (unofficial LLC) does not guarantee uninterrupted access,
                      error-free operation, or any specific results.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      14. Limitation of Liability
                    </h3>
                    <p className="text-muted-foreground">
                      To the maximum extent permitted by law, 3LIXIR MUSIC
                      (unofficial LLC) shall not be liable for indirect,
                      incidental, consequential, or punitive damages. Total
                      liability shall not exceed the amount paid by you to
                      3LIXIR MUSIC (unofficial LLC) in the twelve (12) months
                      preceding the claim.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      15. Indemnification
                    </h3>
                    <p className="text-muted-foreground">
                      You agree to indemnify and hold harmless 3LIXIR MUSIC
                      (unofficial LLC) from any claims, damages, losses, or
                      expenses arising from your use of the Services or
                      violation of these Terms.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      16. Termination
                    </h3>
                    <p className="text-muted-foreground">
                      3LIXIR MUSIC (unofficial LLC) may terminate or suspend
                      your access to the Services at any time, with or without
                      cause. Sections relating to intellectual property, payment
                      obligations, disclaimers, limitation of liability,
                      indemnification, and dispute resolution survive
                      termination.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      17. Governing Law; Arbitration; Class Action Waiver
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      These Terms are governed by the laws of the State of
                      California, without regard to conflict-of-law principles.
                    </p>
                    <p className="text-muted-foreground mb-2">
                      <strong className="text-foreground">
                        Mandatory Arbitration:
                      </strong>{" "}
                      Any dispute, claim, or controversy arising out of or
                      relating to these Terms or the Services shall be resolved
                      by binding arbitration administered by a recognized
                      arbitration provider, rather than in court, except that
                      either party may seek injunctive or equitable relief in a
                      court of competent jurisdiction.
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">
                        Class Action Waiver:
                      </strong>{" "}
                      You agree that any dispute resolution proceedings will be
                      conducted only on an individual basis and not in a class,
                      consolidated, or representative action, to the fullest
                      extent permitted by law.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      18. License Agreement
                    </h3>
                    <p className="text-muted-foreground">
                      Use of any Beat is also subject to the applicable 3LIXIR
                      MUSIC License Agreement, which is incorporated into these
                      Terms by reference. In the event of a conflict between
                      these Terms and a License Agreement, the License Agreement
                      shall control with respect to Beat usage and rights.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      19. Privacy Policy
                    </h3>
                    <p className="text-muted-foreground">
                      The Privacy Policy of 3LIXIR MUSIC (unofficial LLC) is
                      incorporated into these Terms by reference and governs how
                      personal information is collected and used.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      20. International Users and EU Compliance
                    </h3>
                    <p className="text-muted-foreground">
                      If you access the Services from outside the United States,
                      you do so at your own initiative and are responsible for
                      compliance with local laws. 3LIXIR MUSIC (unofficial LLC)
                      makes no representations that the Services are appropriate
                      or available for use in all locations.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      For users located in the European Union or United Kingdom,
                      you may have additional rights under applicable consumer
                      protection and data protection laws. Nothing in these
                      Terms limits rights that cannot be waived under applicable
                      law.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      21. Changes to Terms
                    </h3>
                    <p className="text-muted-foreground">
                      3LIXIR MUSIC (unofficial LLC) may revise these Terms at
                      any time. Updates become effective upon posting. Continued
                      use of the Services constitutes acceptance.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      22. Contact Information
                    </h3>
                    <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-2">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">
                          3LIXIR MUSIC (unofficial LLC)
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
                      END OF TERMS OF SERVICE
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activePolicySection === "privacy" && (
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  3LIXIR MUSIC PRIVACY POLICY
                </h1>
                <p className="text-sm text-muted-foreground mb-8">
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
                  This Privacy Policy describes how{" "}
                  <strong className="text-foreground">
                    3LIXIR MUSIC (unofficial LLC)
                  </strong>{" "}
                  ("we," "us") collects, uses, discloses, and protects personal
                  information when you access or use our website, platform,
                  subscriptions, digital products, DJ 3LIXIR Beats, third-party
                  licensed Beats, and related services (collectively, the
                  "Services"). This Privacy Policy is incorporated by reference
                  into the 3LIXIR MUSIC Terms of Service.
                </p>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      1. Information We Collect
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      We collect the following categories of information:
                    </p>

                    <h4 className="text-xl font-medium mb-3 mt-6">
                      1.1 Information You Provide Directly
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        Name, username, and contact information (such as email
                        address)
                      </li>
                      <li>Account credentials</li>
                      <li>
                        Billing and payment-related information (processed by
                        third-party payment processors)
                      </li>
                      <li>
                        Communications with us (including support requests and
                        emails)
                      </li>
                    </ul>

                    <h4 className="text-xl font-medium mb-3 mt-6">
                      1.2 Information Collected Automatically
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>IP address</li>
                      <li>Device type, browser type, and operating system</li>
                      <li>Pages visited, referring URLs, and usage activity</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>

                    <h4 className="text-xl font-medium mb-3 mt-6">
                      1.3 Payment Information
                    </h4>
                    <p className="text-muted-foreground">
                      3LIXIR MUSIC (unofficial LLC) does not store full payment
                      card information. Payments are processed by third-party
                      payment processors who handle payment data in accordance
                      with their own privacy policies.
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
                        Process transactions, service fees, Subscriptions, and
                        Tokens
                      </li>
                      <li>Manage user accounts</li>
                      <li>
                        Communicate with users regarding updates, support, and
                        service-related notices
                      </li>
                      <li>
                        Enforce our Terms of Service, License Agreements, and
                        platform policies
                      </li>
                      <li>
                        Detect, prevent, and address fraud, abuse, or technical
                        issues
                      </li>
                      <li>Comply with legal and regulatory obligations</li>
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
                      Disabling cookies may affect functionality of the
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
                        communications, and payment processing
                      </li>
                      <li>
                        Legal authorities when required by law or to protect the
                        rights, property, or safety of 3LIXIR MUSIC (unofficial
                        LLC)
                      </li>
                      <li>
                        Business partners strictly as necessary to provide the
                        Services, including licensing and platform operations
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      We do <strong>not</strong> sell personal information.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      5. Data Retention
                    </h3>
                    <p className="text-muted-foreground">
                      We retain personal information for as long as reasonably
                      necessary to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-2">
                      <li>Provide the Services</li>
                      <li>Comply with legal obligations</li>
                      <li>Resolve disputes</li>
                      <li>Enforce agreements</li>
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
                      Depending on your location, you may have the right to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        Access, correct, or delete your personal information
                      </li>
                      <li>
                        Object to or restrict certain processing activities
                      </li>
                      <li>Withdraw consent where applicable</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Requests may be submitted by contacting us using the
                      information provided below.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      8. California Privacy Rights (CCPA/CPRA)
                    </h3>
                    <p className="text-muted-foreground">
                      If you are a California resident, you may have additional
                      rights under the California Consumer Privacy Act (CCPA)
                      and the California Privacy Rights Act (CPRA), including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-2">
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
                      3LIXIR MUSIC (unofficial LLC) does not discriminate
                      against users for exercising their privacy rights.
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
                      age of eighteen (18). 3LIXIR MUSIC (unofficial LLC) does
                      not knowingly collect personal information from children.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      11. Third-Party Links and Services
                    </h3>
                    <p className="text-muted-foreground">
                      The Services may contain links to third-party websites or
                      integrate third-party services. 3LIXIR MUSIC (unofficial
                      LLC) is not responsible for the privacy practices or
                      content of third parties.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      12. Changes to This Privacy Policy
                    </h3>
                    <p className="text-muted-foreground">
                      We may update this Privacy Policy from time to time.
                      Changes become effective upon posting to the Platform.
                      Continued use of the Services constitutes acceptance of
                      the revised Privacy Policy.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      13. Contact Information
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      If you have questions or privacy requests, contact:
                    </p>
                    <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-2">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">
                          3LIXIR MUSIC (unofficial LLC)
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
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  3LIXIR MUSIC BEAT LICENSE AGREEMENT
                </h1>
                <p className="text-sm text-muted-foreground mb-8">
                  <br />
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
                  This Beat License Agreement ("Agreement") is a legally binding
                  agreement between{" "}
                  <strong className="text-foreground">
                    3LIXIR MUSIC (unofficial LLC)
                  </strong>{" "}
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
                        royalty-free usage
                      </strong>{" "}
                      of that Beat only if the Derivative Work is{" "}
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
                      <strong className="text-foreground">Token</strong> to a
                      specific Beat. Tokens:
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
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      7. Publication Requirement
                    </h3>
                    <p className="text-muted-foreground">
                      If a Beat is licensed during a Subscription but not
                      Published before Subscription cancellation or expiration,
                      royalty clearance is not preserved, and additional
                      clearance (Token or re-subscription) is required prior to
                      Publication.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      8. Credit
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Where commercially reasonable, Licensee agrees to credit:
                    </p>
                    <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-muted-foreground mb-4">
                      "Produced by 3LIXIR MUSIC"
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
                      11. Termination
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Licensor may terminate this Agreement upon material
                      breach.
                    </p>
                    <p className="text-muted-foreground mb-2">
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
                  This Refund & Cancellation Policy explains how refunds,
                  cancellations, and billing disputes are handled for purchases
                  made through the 3LIXIR MUSIC (unofficial LLC) platform. This
                  policy is incorporated by reference into the 3LIXIR MUSIC
                  Terms of Service, Beat License Agreement, and Return Policy.
                </p>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      1. General Policy
                    </h3>
                    <p className="text-muted-foreground">
                      Due to the digital nature of our products and services,{" "}
                      <strong className="text-foreground">
                        all sales are final
                      </strong>
                      , except where refunds are required by applicable law. By
                      purchasing or subscribing to any 3LIXIR MUSIC product or
                      service, you acknowledge and agree to this policy.
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
                      <li>
                        Subscription fees (partial or unused billing periods)
                      </li>
                      <li>Production services once work has begun</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Once a Beat has been delivered, downloaded, accessed, or
                      licensed, it is considered used and ineligible for refund.
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
                      at checkout.
                    </p>

                    <h4 className="text-xl font-medium mb-3 mt-6">
                      3.2 Cancellation
                    </h4>
                    <p className="text-muted-foreground mb-2">
                      You may cancel your Subscription at any time through your
                      account dashboard or by contacting support. Cancellation:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Stops future billing</li>
                      <li>Does not refund the current billing period</li>
                      <li>
                        Does not revoke rights properly granted under an active
                        Subscription, as defined in the Terms of Service and
                        License Agreement
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Access to Subscription-only features may terminate
                      immediately upon cancellation or at the end of the billing
                      cycle, depending on the plan.
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
                      Applying a Token permanently satisfies the royalty
                      clearance requirement for the applicable Beat and cannot
                      be reversed.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      5. Exceptional Circumstances
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Refunds may be considered solely at the discretion of
                      3LIXIR MUSIC in limited circumstances, such as:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Duplicate charges due to technical error</li>
                      <li>Billing errors confirmed by our payment processor</li>
                      <li>
                        Platform errors that prevented access after confirmed
                        payment
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      No refunds will be issued for dissatisfaction, change of
                      mind, lack of use, or misunderstanding of license terms.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Any resolution may include account credit, replacement
                      access, or correction, rather than a monetary refund.
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
                      <li>Revocation of access to the Services</li>
                      <li>Loss of any granted licenses or benefits</li>
                      <li>Permanent restriction from future purchases</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      We reserve the right to dispute chargebacks and provide
                      documentation to payment processors.
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
                      <li>Misunderstanding license terms</li>
                      <li>Purchasing without intended use</li>
                      <li>Failure to review documentation</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      do not qualify for a refund or reversal.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      8. Relationship to Return Policy
                    </h3>
                    <p className="text-muted-foreground">
                      This Refund & Cancellation Policy works in conjunction
                      with the Return Policy. Because all products and services
                      are digital, no physical returns are possible. See the
                      Return Policy for additional details.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      9. Legal Compliance
                    </h3>
                    <p className="text-muted-foreground">
                      Nothing in this policy limits any non-waivable rights you
                      may have under applicable consumer protection laws. If
                      local law requires a refund, we will comply to the extent
                      required.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      10. Changes to This Policy
                    </h3>
                    <p className="text-muted-foreground">
                      We reserve the right to update or modify this Refund &
                      Cancellation Policy at any time. Changes become effective
                      upon posting to the Platform.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      11. Contact Information
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      For billing questions or cancellation assistance, contact:
                    </p>
                    <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-2">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">
                          3LIXIR MUSIC (unofficial LLC)
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
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
                  3LIXIR MUSIC DMCA COPYRIGHT INFRINGEMENT POLICY
                </h1>
                <p className="text-sm text-muted-foreground mb-8">
                  Last Updated: January 2026
                </p>

                <p className="text-muted-foreground mb-8">
                  3LIXIR MUSIC (unofficial LLC) respects the intellectual
                  property rights of others and expects all users of its
                  services to do the same. This Digital Millennium Copyright Act
                  ("DMCA") Copyright Infringement Policy describes the
                  procedures we follow to respond to claims of copyright
                  infringement in accordance with the DMCA (17 U.S.C. § 512).
                </p>

                <p className="text-muted-foreground mb-8">
                  This policy applies to all content made available through the
                  3LIXIR MUSIC platform, including but not limited to DJ 3LIXIR
                  Beats, third-party licensed Beats, user-submitted materials
                  (if applicable), and related services.
                </p>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      1. Designated DMCA Agent
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Pursuant to the DMCA, 3LIXIR MUSIC (unofficial LLC) has
                      designated the following agent to receive notifications of
                      claimed copyright infringement:
                    </p>
                    <div className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-2">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">DMCA Agent:</strong>{" "}
                        3LIXIR MUSIC (unofficial LLC)
                      </p>
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Email:</strong>{" "}
                        <span className="text-[hsl(var(--gold))]">
                          support@3lixirmusic.com
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Address:</strong>{" "}
                        [Business Address]
                      </p>
                    </div>
                    <p className="text-muted-foreground mt-4 italic">
                      Only DMCA-compliant notices sent to this agent will be
                      processed.
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
                        information reasonably sufficient to permit us to locate
                        the material
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
                        information in the notification is accurate and that you
                        are authorized to act on behalf of the copyright owner
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
                      (unofficial LLC) may, at its discretion and in accordance
                      with applicable law:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        Remove or disable access to the allegedly infringing
                        material
                      </li>
                      <li>Notify the affected user or licensee</li>
                      <li>
                        Restrict or terminate access for repeat infringers
                      </li>
                      <li>
                        Take any other action deemed appropriate under the DMCA
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Nothing in this policy requires 3LIXIR MUSIC to adjudicate
                      ownership disputes or contractual license disagreements.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      4. Counter-Notification Procedure
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      If you believe that material removed or disabled pursuant
                      to a DMCA notice was removed as a result of mistake or
                      misidentification, you may submit a counter-notification
                      that includes:
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
                      Counter-notifications must be sent to the DMCA Agent
                      listed above.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-semibold tracking-tight mb-3">
                      5. Repeat Infringer Policy
                    </h3>
                    <p className="text-muted-foreground">
                      In accordance with the DMCA, 3LIXIR MUSIC (unofficial LLC)
                      maintains a policy of terminating, in appropriate
                      circumstances and at its sole discretion, users who are
                      determined to be repeat copyright infringers.
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
                      7. Licensing Disputes
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      DMCA notices must not be used to resolve licensing
                      disputes, royalty disagreements, or contractual conflicts.
                      Beats licensed through 3LIXIR MUSIC are governed by the
                      applicable Beat License Agreement and Terms of Service.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Improper DMCA submissions based on licensing
                      misunderstandings may be rejected.
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
                      We reserve the right to modify this DMCA Policy at any
                      time. Changes become effective upon posting to the
                      platform. Continued use of the Services constitutes
                      acceptance of the revised policy.
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
                <div className="flex items-center justify-center gap-3">
                  <Mail className="w-5 h-5 text-[hsl(var(--gold))]" />
                  <div className="text-center">
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">
                      support@3lixirmusic.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5 text-[hsl(var(--gold))]" />
                  <div className="text-center">
                    <p className="font-semibold">Response Time</p>
                    <p className="text-muted-foreground">Within 24-48 hours</p>
                  </div>
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
