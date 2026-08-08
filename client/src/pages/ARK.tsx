// client/src/pages/ARK.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/supabaseClient";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l10 6v8l-10 6L4 18v-8l10-6z" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 4v16M4 10l10 6 10-6" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Feature One",
    desc: "Describe the first key feature of ARK here. What makes it powerful for producers?",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="20" height="16" rx="3" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M9 12h10M9 16h6" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Feature Two",
    desc: "Describe the second key feature of ARK here. What workflow does it unlock?",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4a10 10 0 1 1 0 20A10 10 0 0 1 14 4z" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M14 9v5l3 3" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Feature Three",
    desc: "Describe the third key feature of ARK here. What sets it apart from everything else?",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 14a8 8 0 0 1 16 0" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 18l4-4 4 4" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 14v8" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Feature Four",
    desc: "Describe the fourth key feature of ARK here.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="4" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M10 14l3 3 5-5" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Feature Five",
    desc: "Describe the fifth key feature of ARK here.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M14 9v2M14 17v2M9 14h2M17 14h2" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Feature Six",
    desc: "Describe the sixth key feature of ARK here.",
  },
];

const steps = [
  { num: "01", label: "Step One", desc: "Describe the first step to get started with ARK." },
  { num: "02", label: "Step Two", desc: "Describe the second step in the ARK workflow." },
  { num: "03", label: "Step Three", desc: "Describe the third step — what the user gets at the end." },
];

export default function ARK() {
  const isMobile = useIsMobile();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();
  const [plugin, setPlugin] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("plugins").select("*");
      const match = (data || []).find((p: any) =>
        (p.name || p.title || "").trim().toLowerCase().includes("ark")
      );
      setPlugin(match || null);
    })();
  }, []);

  const handleGet = () => {
    if (!plugin) {
      setLocation("/vst");
      return;
    }
    const price =
      typeof plugin.price === "number"
        ? plugin.price
        : parseFloat(String(plugin.price ?? plugin.price_usd ?? "").replace(/[^0-9.]/g, "")) || 0;
    addToCart({
      id: String(plugin.id),
      title: plugin.name || plugin.title || "ARK",
      artist: "3LIXIR Music",
      price,
      cover: plugin.image || plugin.image_url || "",
      quantity: 1,
      type: "plugin",
      category: plugin.category || "Instruments",
      image: plugin.image || plugin.image_url || undefined,
    });
    setLocation("/shop");
  };

  const scrollToDetails = () => {
    document
      .getElementById("technical-details")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Hero product image banner */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundImage: 'url("/ARK_PRODUCT_IMAGE.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          aspectRatio: "16 / 9",
          width: "100%",
          backgroundColor: "#0a0a0a",
        }}
      >
        {/* Fallback placeholder when no image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            zIndex: 0,
          }}
        >
          <div
            style={{
              fontSize: "clamp(60px, 12vw, 140px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "rgba(201,168,76,0.08)",
              lineHeight: 1,
            }}
          >
            ARK
          </div>
        </div>
        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)",
            zIndex: 1,
          }}
        />
      </div>

      {/* Development disclaimer */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(201,168,76,0.08)",
          borderTop: "1px solid rgba(201,168,76,0.25)",
          borderBottom: "1px solid rgba(201,168,76,0.25)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            textAlign: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "16px" }}>⚠️</span>
          <span style={{ fontSize: "13px", color: "#d8c07a", lineHeight: 1.5 }}>
            <strong style={{ color: "#e8c76a" }}>In active development.</strong>{" "}
            ARK's preset library is still being expanded and you may run into the
            occasional bug. The synth engine is fully functional — more presets
            and fixes are on the way.
          </span>
        </div>
      </div>

      {/* Store Sub-Navbar - Full Width */}
      <div
        style={{
          borderTop: "1px solid #C9A84C",
          borderBottom: "1px solid #C9A84C",
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
          alignItems: "stretch",
          background: "#000",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[
          { label: "Beats", href: "/beats" },
          { label: "VST Plugins", href: "/vst" },
          { label: "Merchandise", href: "/merchandise" },
          { label: "Plugin Installer", href: "/loader" },
        ].map((item, index) => (
          <Link key={item.href + index} href={item.href}>
            <div
              style={{
                padding: isMobile ? "16px 12px" : "16px 24px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C9A84C",
                cursor: "pointer",
                borderLeft:
                  !isMobile && index !== 0 ? "1px solid rgba(201,168,76,0.2)" : "none",
                borderTop:
                  isMobile && index >= 2 ? "1px solid rgba(201,168,76,0.2)" : "none",
                borderRight:
                  isMobile && index % 2 === 0 ? "1px solid rgba(201,168,76,0.2)" : "none",
                transition: "background 0.2s ease, color 0.2s ease",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.07)";
                (e.currentTarget as HTMLElement).style.color = "#e8c76a";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#C9A84C";
              }}
            >
              {item.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Mirrored brick background wrapper */}
      <div style={{ position: "relative" }}>
        {/* Fixed brick background - matches Downloads page */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "50%",
              backgroundImage: 'url("/black_gold_brick_texture.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "50%",
              backgroundImage: 'url("/black_gold_brick_texture.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.4,
              transform: "scaleX(-1)",
            }}
          />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Hero text content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "0 24px",
              paddingTop: "80px",
              paddingBottom: "80px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "32px",
            }}
          >
            {/* Badge */}
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A84C",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "100px",
                padding: "5px 16px",
              }}
            >
              3LIXIR MUSIC ARK SYNTHESIZER
            </div>

            {/* Product Image */}
            <img
              src="/ARK SYNTHESIZER .png"
              alt="ARK Synthesizer"
              style={{
                width: "1000px",
                height: "auto",
                borderRadius: "16px",
                boxShadow: "0 0 60px rgba(201,168,76,0.1)",
              }}
            />

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(48px, 8vw, 88px)",
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              ARK
              <br />
              <span style={{ color: "#333" }}>Our solution for</span>
              <br />
              <span style={{ color: "#C9A84C" }}>your production needs.</span>
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "#555",
                maxWidth: "500px",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Pick up your copy of ARK — a modern twist on the 80's synthesizer. A wavetable engine with 12 oscillators, 4 choir generators, and a Moog-style ladder filter, loaded with 238 factory presets.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={handleGet}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 32px",
                  background: "#C9A84C",
                  color: "#000",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  borderRadius: "100px",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                Get ARK
              </button>

              <button
                onClick={scrollToDetails}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 32px",
                  background: "transparent",
                  color: "#C9A84C",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  borderRadius: "100px",
                  border: "1px solid #C9A84C",
                  cursor: "pointer",
                  transition: "background 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#C9A84C";
                  (e.currentTarget as HTMLElement).style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#C9A84C";
                }}
              >
                Learn More
              </button>
            </div>

            <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>
              VST3 &amp; AU · macOS &amp; Windows
            </p>
          </div>

          {/* Waveform image + description */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "80px 24px",
              display: "flex",
              alignItems: "center",
              gap: "48px",
            }}
          >
            {/* Image on the left */}
            <div style={{ flex: "0 0 auto", maxWidth: "420px" }}>
              <img
                src="/waveform.png"
                alt="Waveform"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px",
                }}
              />
            </div>

            {/* Text on the right */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: "16px",
                }}
              >
                Oscillator Engine
              </div>
              <h2
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: "0 0 16px 0",
                  lineHeight: 1.2,
                }}
              >
                Powerful waveform shaping
                <br />
                <span style={{ color: "#C9A84C" }}>at your fingertips.</span>
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "#888",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                ARK's oscillator engine gives you full control over your sound with multiple waveform types, unison stacking, fine-tuning, and wavetable positioning. Shape every detail of your tone from the ground up.
              </p>
            </div>
          </div>

          {/* String Generator image + description */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "80px 24px",
              display: "flex",
              alignItems: "center",
              gap: "48px",
            }}
          >
            {/* Text on the left */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: "16px",
                }}
              >
                String Engine
              </div>
              <h2
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: "0 0 16px 0",
                  lineHeight: 1.2,
                }}
              >
                Authentic string modeling
                <br />
                <span style={{ color: "#C9A84C" }}>built from the ground up.</span>
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "#888",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                ARK's string generator delivers rich, expressive string tones with deep control over every parameter. Layer and shape organic textures that cut through any mix.
              </p>
            </div>

            {/* Image on the right */}
            <div style={{ flex: "0 0 auto", maxWidth: "420px" }}>
              <img
                src="/String generator.png"
                alt="String Generator"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px",
                }}
              />
            </div>
          </div>

          {/* Choir Generator image + description */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "80px 24px",
              display: "flex",
              alignItems: "center",
              gap: "48px",
            }}
          >
            {/* Image on the left */}
            <div style={{ flex: "0 0 auto", maxWidth: "420px" }}>
              <img
                src="/Choir Generator.png"
                alt="Choir Generator"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px",
                }}
              />
            </div>

            {/* Text on the right */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: "16px",
                }}
              >
                Choir Engine
              </div>
              <h2
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: "0 0 16px 0",
                  lineHeight: 1.2,
                }}
              >
                Ethereal vocal textures
                <br />
                <span style={{ color: "#C9A84C" }}>ready to inspire.</span>
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "#888",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                ARK's choir generator brings lush, heavenly vocal layers to your productions. Shape choral pads, vocal stacks, and atmospheric textures with precision control.
              </p>
            </div>
          </div>

          {/* Arpeggiator - centered image with text below */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "80px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "32px",
            }}
          >
            <img
              src="/ARP.png"
              alt="ARK Arpeggiator"
              style={{
                width: "100%",
                maxWidth: "900px",
                height: "auto",
                borderRadius: "12px",
              }}
            />
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A84C",
              }}
            >
              Arpeggiator
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Rhythmic sequences
              <br />
              <span style={{ color: "#C9A84C" }}>at your fingertips.</span>
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#888",
                lineHeight: 1.8,
                margin: 0,
                maxWidth: "600px",
              }}
            >
              ARK's built-in arpeggiator transforms chords into dynamic patterns. Control rate, gate, swing, octave range, and direction to create evolving melodic sequences instantly.
            </p>

            {/* Filter - centered below arp text */}
            <img
              src="/Filter.png"
              alt="ARK Filter"
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                borderRadius: "12px",
              }}
            />
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A84C",
              }}
            >
              Filter
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Shape your sound
              <br />
              <span style={{ color: "#C9A84C" }}>with precision.</span>
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#888",
                lineHeight: 1.8,
                margin: 0,
                maxWidth: "600px",
              }}
            >
              ARK's filter section gives you full control with LP, HP, BP, and Notch modes. Dial in cutoff, resonance, and drive, then shape the envelope with dedicated ATK, DCY, SUS, and REL controls.
            </p>
          </div>

          {/* Olympus FX Rack included section */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "80px 24px",
              display: "flex",
              alignItems: "center",
              gap: "48px",
            }}
          >
            <div style={{ flex: "0 0 auto", maxWidth: "520px" }}>
              <img
                src="/ARKFXRACK.png"
                alt="3LIXIR Olympus Plugin Suite FX Rack"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px",
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: "16px",
                }}
              >
                Included Bonus Suite
              </div>
              <h2
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: "0 0 16px 0",
                  lineHeight: 1.2,
                }}
              >
                The official 3LIXIR MUSIC
                <br />
                <span style={{ color: "#C9A84C" }}>Olympus plugin suite included.</span>
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "#888",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Every ARK purchase comes bundled with the official 3LIXIR MUSIC Olympus plugin suite,
                giving you an expanded FX rack for sculpting, enhancing, and finishing your sound right out of the box.
              </p>
            </div>
          </div>

          {/* About / Story section */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "820px",
              margin: "0 auto",
              padding: "90px 24px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "24px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A84C",
              }}
            >
              The Story
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 46px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Old-school soul,
              <br />
              <span style={{ color: "#C9A84C" }}>modern-day engine.</span>
            </h2>
            <p style={{ fontSize: "16px", color: "#999", lineHeight: 1.9, margin: 0 }}>
              ARK is my own modern twist on the classic 80's synthesizer — a
              wavetable instrument coded from the ground up in C++. Under the
              hood: 12 oscillators, dedicated string and choir generators, a
              built-in arpeggiator, and a Moog-style ladder filter, all built
              around the way producers actually work.
            </p>
            <p style={{ fontSize: "16px", color: "#999", lineHeight: 1.9, margin: 0 }}>
              Every copy ships with 238 factory presets and the full 3LIXIR
              Olympus FX suite baked in — and this is only the beginning. I'm
              building toward a 1,500-preset library, with new sounds and
              refinements rolling out through free updates. ARK is a living
              instrument that only gets better over time.
            </p>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #111", position: "relative", zIndex: 1 }} />

          {/* Bottom CTA */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "100px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(36px, 6vw, 68px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.05,
              }}
            >
              Get ARK.
              <br />
              <span style={{ color: "#C9A84C" }}>A modern twist on the 80's.</span>
            </h2>
            <p style={{ fontSize: "17px", color: "#888", maxWidth: "440px", lineHeight: 1.7, margin: 0 }}>
              One synth, endless character. Grab your copy of ARK and start building.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={handleGet}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "18px 40px",
                  background: "#C9A84C",
                  color: "#000",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  borderRadius: "100px",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                Get ARK
              </button>
              <button
                onClick={scrollToDetails}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "18px 40px",
                  background: "transparent",
                  color: "#C9A84C",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  borderRadius: "100px",
                  border: "1px solid #C9A84C",
                  cursor: "pointer",
                  transition: "background 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#C9A84C";
                  (e.currentTarget as HTMLElement).style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#C9A84C";
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #111", position: "relative", zIndex: 1 }} />

          {/* How it works */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "80px 24px 40px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: "16px",
                }}
              >
                How It Works
              </div>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                From checkout to your DAW,
                <br />
                <span style={{ color: "#C9A84C" }}>in three steps.</span>
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              {[
                { num: "01", label: "Get the Loader", desc: "Download the free 3LIXIR Loader for Mac or PC — the installer app that delivers your plugins straight to your DAW." },
                { num: "02", label: "Purchase ARK", desc: "Buy ARK right here. Your license is added to your 3LIXIR account the moment checkout completes." },
                { num: "03", label: "Sign in & install", desc: "Open the Loader, log into your 3LIXIR account, and ARK is ready to install to your DAW with a single click." },
              ].map((step) => (
                <div
                  key={step.num}
                  style={{
                    background: "#080808",
                    border: "1px solid #1a1a1a",
                    borderRadius: "16px",
                    padding: "32px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "44px",
                      fontWeight: 800,
                      color: "rgba(201,168,76,0.14)",
                      lineHeight: 1,
                      marginBottom: "18px",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {step.num}
                  </div>
                  <div style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: "14px", color: "#888", lineHeight: 1.7 }}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video embed */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "40px 24px",
            }}
          >
            <iframe
              width="100%"
              height="auto"
              style={{
                aspectRatio: "16 / 9",
                borderRadius: "16px",
              }}
              src="https://www.youtube.com/embed/a4CFV_Tvr0U"
              title="ARK Synth — Making EDM with 80's Sounds"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #111", position: "relative", zIndex: 1 }} />

          {/* Spec / technical details table */}
          <div
            id="technical-details"
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "680px",
              margin: "0 auto",
              padding: "40px 24px 90px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A84C",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Technical Details
            </div>
            <div
              style={{
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "14px",
                overflow: "hidden",
                background: "rgba(10,10,10,0.6)",
              }}
            >
              {([
                ["Version", "1.1.0"],
                ["Formats", "VST3, AU"],
                ["Platforms", "macOS 11+ · Windows 10+"],
                ["Architecture", "Universal (Intel + Apple Silicon)"],
                ["DAW Compatibility", "Any VST3/AU-compatible DAW"],
                ["Sound Engine", "Wavetable — 12 oscillators, string + choir generators, arpeggiator, Moog-style ladder filter"],
                ["Presets", "238 included (building toward 1,500)"],
                ["Included", "3LIXIR Olympus FX suite"],
                ["License", "Unlimited access to the plugin, for life"],
              ] as [string, string][]).map(([label, value], i, arr) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "baseline",
                    gap: isMobile ? "4px" : "24px",
                    padding: "16px 22px",
                    borderBottom:
                      i < arr.length - 1
                        ? "1px solid rgba(201,168,76,0.1)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#C9A84C",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#ccc",
                      lineHeight: 1.6,
                      textAlign: isMobile ? "left" : "right",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>{/* end brick inner */}
      </div>{/* end brick wrapper */}
    </div>
  );
}
