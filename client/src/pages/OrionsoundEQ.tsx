// client/src/pages/OrionsoundEQ.tsx
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
        <path d="M14 4v14M14 18l-5-5M14 18l5-5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 22h20" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Precision EQ Control",
    desc: "Shape your sound with surgical precision. Orion Sound EQ gives you full control over every frequency band with intuitive, responsive controls.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="20" height="16" rx="3" stroke="#22c55e" strokeWidth="1.8" />
        <path d="M9 12h10M9 16h6" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Visual Spectrum Analyzer",
    desc: "See your audio in real time. The built-in spectrum analyzer lets you visualize frequency response as you sculpt your mix.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4a10 10 0 1 1 0 20A10 10 0 0 1 14 4z" stroke="#22c55e" strokeWidth="1.8" />
        <path d="M14 9v5l3 3" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Zero Latency",
    desc: "Designed for real-time performance. Orion Sound EQ delivers zero-latency processing so your workflow stays seamless.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 14a8 8 0 0 1 16 0" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 18l4-4 4 4" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 14v8" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "DAW Compatible",
    desc: "Works with all major DAWs — Ableton, FL Studio, Logic Pro, Pro Tools, Studio One, and more.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="4" stroke="#22c55e" strokeWidth="1.8" />
        <path d="M10 14l3 3 5-5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Preset Library",
    desc: "Get started fast with professionally crafted presets for vocals, drums, bass, and more. Save and share your own custom presets.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#22c55e" strokeWidth="1.8" />
        <path d="M14 9v2M14 17v2M9 14h2M17 14h2" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Lightweight & Efficient",
    desc: "Orion Sound EQ is optimized for minimal CPU usage. Load it on every track without worrying about system resources.",
  },
];

const steps = [
  { num: "01", label: "Download Orion", desc: "Grab the installer for Mac or PC below." },
  { num: "02", label: "Load in Your DAW", desc: "Open your DAW and load Orion Sound EQ as a plugin on any track." },
  { num: "03", label: "Shape Your Sound", desc: "Dial in your EQ settings and hear the difference instantly." },
];

async function downloadOrion(platform: 'mac' | 'pc') {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-orion-download?platform=${platform}`,
      {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      }
    );
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    if (data.error || !data.url) throw new Error(data.error || 'No URL returned');
    window.open(data.url, '_blank');
  } catch (err) {
    console.error('Download error:', err);
    alert('Download unavailable. Please try again shortly.');
  }
}

export default function OrionSoundEQ() {
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
        (p.name || p.title || "").trim().toLowerCase().includes("orion")
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
      title: plugin.name || plugin.title || "Orion Sound EQ",
      artist: "3LIXIR Music",
      price,
      cover: plugin.image || plugin.image_url || "",
      quantity: 1,
      type: "plugin",
      category: plugin.category || "Audio Units",
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
          background: "radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Hero product image banner */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundImage: 'url("/OrionSoundEQ%20Product%20Box.png")',
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
            Orion
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

      {/* Mirrored brick background wrapper for content sections */}
      <div style={{ position: "relative" }}>
        {/* Left half - normal */}
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
            zIndex: 0,
          }}
        />
        {/* Right half - mirrored */}
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
            zIndex: 0,
          }}
        />
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
            color: "#22c55e",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "100px",
            padding: "5px 16px",
          }}
        >
          Official Plugin
        </div>

        {/* Product Image */}
        <img
          src="/OrionSoundEQ.png"
          alt="Orion Sound EQ Product Box"
          style={{
            width: "100%",
            maxWidth: "980px",
            height: "auto",
            borderRadius: "16px",
            boxShadow: "0 0 60px rgba(34,197,94,0.1)",
          }}
        />

        {/* App icon */}
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "24px",
            background: "linear-gradient(145deg, #0d1a0d, #111)",
            border: "1px solid rgba(34,197,94,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 60px rgba(34,197,94,0.1)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path d="M6 30l8-16 6 10 6-14 8 20" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 22h32" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="3 3" />
          </svg>
        </div>

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
          Orion Sound EQ
          <br />
          <span style={{ color: "#333" }}>Your Sound.</span>
          <br />
          <span style={{ color: "#22c55e" }}>Perfected.</span>
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
          The official equalizer plugin by 3LIXIR MUSIC. Shape, sculpt, and
          refine every frequency in your mix — with precision.
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
              background: "#22c55e",
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
            Get Orion
          </button>

          <button
            onClick={scrollToDetails}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 32px",
              background: "transparent",
              color: "#22c55e",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: "100px",
              border: "1px solid #22c55e",
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#22c55e";
              (e.currentTarget as HTMLElement).style.color = "#000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#22c55e";
            }}
          >
            Learn More
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>
          VST3 &amp; AU · macOS &amp; Windows
        </p>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #111", position: "relative", zIndex: 1 }} />

      {/* 32-Band Custom EQ Section */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          padding: "48px 24px 28px",
          display: "flex",
          alignItems: "center",
          gap: "32px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ flex: "1 1 55%" }}>
          <img
            src="/Orion32Band.png"
            alt="Orion Sound EQ 32-band custom EQ view"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
            }}
          />
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#22c55e",
              marginBottom: "12px",
            }}
          >
            32-Band Custom EQ
          </div>
          <h2
            style={{
              fontSize: "clamp(20px, 2.5vw, 30px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 12px 0",
              lineHeight: 1.2,
            }}
          >
            Build the exact curve
            <br />
            <span style={{ color: "#22c55e" }}>your mix needs.</span>
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#888",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Orion lets you create a custom EQ with anywhere from 1 to 32 points.
            Keep it simple with broad tonal shaping, or go surgical and place
            precise bands exactly where your sound needs control.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #111", position: "relative", zIndex: 1 }} />

      {/* Presets Section */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          padding: "28px 24px 48px",
          display: "flex",
          alignItems: "center",
          gap: "32px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ flex: "1 1 45%" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#22c55e",
              marginBottom: "12px",
            }}
          >
            Factory Presets
          </div>
          <h2
            style={{
              fontSize: "clamp(20px, 2.5vw, 30px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 12px 0",
              lineHeight: 1.2,
            }}
          >
            Over 100 presets
            <br />
            <span style={{ color: "#22c55e" }}>ready to drop in.</span>
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#888",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Start fast with 100+ professionally tuned presets across vocals,
            drums, instruments, and full mixes. Load a preset, tweak to taste,
            and lock in polished tone in seconds.
          </p>
        </div>
        <div style={{ flex: "1 1 55%" }}>
          <img
            src="/OrionPresets.png"
            alt="Orion Sound EQ presets browser"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
            }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #111", position: "relative", zIndex: 1 }} />

      {/* Single / Multiband Section */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          padding: "28px 24px 48px",
          display: "flex",
          alignItems: "center",
          gap: "32px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ flex: "1 1 55%" }}>
          <img
            src="/OrionMultiband.png"
            alt="Orion Sound EQ single-band and multiband mode"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
            }}
          />
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#22c55e",
              marginBottom: "12px",
            }}
          >
            Single / Multiband Control
          </div>
          <h2
            style={{
              fontSize: "clamp(20px, 2.5vw, 30px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 12px 0",
              lineHeight: 1.2,
            }}
          >
            One plugin,
            <br />
            <span style={{ color: "#22c55e" }}>two ways to shape.</span>
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#888",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Use single-band mode for fast, musical tone shaping across the full signal.
            Switch to multiband mode when you need tighter control over lows, mids, and highs
            independently for cleaner, more transparent processing.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #111", position: "relative", zIndex: 1 }} />

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
            color: "#22c55e",
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
          Find every
          <br />
          <span style={{ color: "#22c55e" }}>point of light.</span>
        </h2>
        <p style={{ fontSize: "16px", color: "#999", lineHeight: 1.9, margin: 0 }}>
          In the noise of a busy mix, every frequency is a point of light waiting
          to be found. Orion is 3LIXIR's precision equalizer — coded from the
          ground up in C++ to bring order to the chaos. Chart a custom curve
          across up to 32 bands, watch each frequency flare to life in the
          real-time spectrum analyzer, and navigate between single-band and
          multiband processing without a trace of latency.
        </p>
        <p style={{ fontSize: "16px", color: "#999", lineHeight: 1.9, margin: 0 }}>
          When you need a fast starting point, 100+ professionally tuned presets
          for vocals, drums, instruments, and full mixes light the way — then
          steer them wherever your ear leads. Light enough to sit on every track,
          Orion also joins Apollo and Hades in the 3LIXIR Olympus suite; claim all
          three in the Olympus Bundle and save 15%.
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
          Get Orion.
          <br />
          <span style={{ color: "#22c55e" }}>Sculpt every frequency.</span>
        </h2>
        <p style={{ fontSize: "17px", color: "#888", maxWidth: "440px", lineHeight: 1.7, margin: 0 }}>
          Precision EQ with 100+ presets, single and multiband modes, and a real-time analyzer. Grab your copy of Orion and dial in your mix.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={handleGet}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "18px 40px",
              background: "#22c55e",
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
            Get Orion
          </button>
          <button
            onClick={scrollToDetails}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "18px 40px",
              background: "transparent",
              color: "#22c55e",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: "100px",
              border: "1px solid #22c55e",
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#22c55e";
              (e.currentTarget as HTMLElement).style.color = "#000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#22c55e";
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
              color: "#22c55e",
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
            <span style={{ color: "#22c55e" }}>in three steps.</span>
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
            { num: "02", label: "Purchase Orion", desc: "Buy Orion right here. Your license is added to your 3LIXIR account the moment checkout completes." },
            { num: "03", label: "Sign in & install", desc: "Open the Loader, log into your 3LIXIR account, and Orion is ready to install to your DAW with a single click." },
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
                  color: "rgba(34,197,94,0.14)",
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
            color: "#22c55e",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Technical Details
        </div>
        <div
          style={{
            border: "1px solid rgba(34,197,94,0.2)",
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
            ["Type", "Equalizer — single-band & multiband"],
            ["Features", "Up to 32 bands, spectrum analyzer, zero latency, low CPU"],
            ["Presets", "100+ factory presets included"],
            ["Bundle", "Olympus Bundle — with Apollo & Hades, save 15%"],
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
                    ? "1px solid rgba(34,197,94,0.1)"
                    : "none",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#22c55e",
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
