// client/src/pages/3lixirloader.tsx
import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4v14M14 18l-5-5M14 18l5-5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 22h20" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "One-Click Install",
    desc: "Download and install any 3LIXIR plugin directly to your DAW with a single click. No manual file moving required.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="20" height="16" rx="3" stroke="#22c55e" strokeWidth="1.8" />
        <path d="M9 12h10M9 16h6" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Plugin Library",
    desc: "Browse your entire 3LIXIR plugin catalog in one place. All purchases, free releases, and updates — organized automatically.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4a10 10 0 1 1 0 20A10 10 0 0 1 14 4z" stroke="#22c55e" strokeWidth="1.8" />
        <path d="M14 9v5l3 3" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Auto Updates",
    desc: "Stay on the latest version without lifting a finger. 3LIXIR Loader checks for updates and installs them in the background.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 14a8 8 0 0 1 16 0" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 18l4-4 4 4" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 14v8" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "DAW Sync",
    desc: "Compatible with all major DAWs — Ableton, FL Studio, Logic Pro, Pro Tools, Studio One, and more.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="4" stroke="#22c55e" strokeWidth="1.8" />
        <path d="M10 14l3 3 5-5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "License Verification",
    desc: "Your licenses are verified automatically. Just log in with your 3LIXIR account and your owned plugins are ready to install.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#22c55e" strokeWidth="1.8" />
        <path d="M14 9v2M14 17v2M9 14h2M17 14h2" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Always Free",
    desc: "3LIXIR Loader is completely free to download and use. It's included with every 3LIXIR account — no subscription needed.",
  },
];

const steps = [
  { num: "01", label: "Download Loader", desc: "Grab the installer for Mac or PC below." },
  { num: "02", label: "Sign In", desc: "Log into your 3LIXIR account inside the app." },
  { num: "03", label: "Browse & Install", desc: "Pick any plugin from your library and hit Install." },
];

export default function LoaderPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

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

      {/* Hero */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          paddingTop: "110px",
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
          Official App
        </div>

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
            <path d="M22 6v22M22 28l-8-8M22 28l8-8" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 36h28" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
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
          3LIXIR Loader
          <br />
          <span style={{ color: "#333" }}>Your Plugins.</span>
          <br />
          <span style={{ color: "#22c55e" }}>One Click.</span>
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
          The official plugin manager for 3LIXIR MUSIC. Install, update, and
          manage every plugin you own — automatically.
        </p>

        {/* Download buttons */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          {/* Mac */}
          <a
            href="#"
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
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 1.5C10.5 1.5 9.5 2 9 3c.8.5 1.5 1.5 1.5 2.5 0 1-.5 2-1.5 2.5.5 1 1.5 1.5 2.5 1.5 1.5 0 3-1.5 3-4 0-2.5-1-4-3-4zM5 4C3 4 1.5 6 1.5 8.5 1.5 11 3 14 5 14c.8 0 1.5-.5 2-.5s1.2.5 2 .5c2 0 3.5-3 3.5-5.5C10.5 7 9 6 8 6c-.8 0-1.5.5-2 .5S5.8 6 5.5 6C5.2 6 5 5 5 4z" fill="currentColor" />
            </svg>
            Download for Mac
          </a>

          {/* PC */}
          <a
            href="#"
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
              textDecoration: "none",
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M5 14h6M8 12v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Download for PC
          </a>
        </div>

        <p style={{ fontSize: "12px", color: "#333", margin: 0 }}>
          Free · macOS 11+ · Windows 10+ · v1.0
        </p>
      </div>

      {/* Store Sub-Navbar - Full Width */}
      <div
        style={{
          borderTop: "1px solid #C9A84C",
          borderBottom: "1px solid #C9A84C",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[
          { label: "Beats", href: "/beats" },
          { label: "VST Plugins", href: "/vst" },
          { label: "Merchendise", href: "/shop" },
          { label: "Plugin Installer", href: "/loader" },
        ].map((item, index) => (
          <Link key={item.href + index} href={item.href}>
            <div
              style={{
                padding: "16px 80px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C9A84C",
                cursor: "pointer",
                borderLeft: index !== 0 ? "1px solid rgba(201,168,76,0.2)" : "none",
                transition: "background 0.2s ease, color 0.2s ease",
                whiteSpace: "nowrap",
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

      {/* Divider */}
      <div style={{ borderTop: "1px solid #111", position: "relative", zIndex: 1 }} />

      {/* How it works */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
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
            }}
          >
            Up and running
            <br />
            <span style={{ color: "#333" }}>in three steps.</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredStep(i)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{
                background: hoveredStep === i ? "#0a0a0a" : "#080808",
                border: `1px solid ${hoveredStep === i ? "rgba(34,197,94,0.25)" : "#111"}`,
                borderRadius: "16px",
                padding: "32px",
                transition: "border-color 0.2s ease, background 0.2s ease",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 800,
                  color: "rgba(34,197,94,0.12)",
                  lineHeight: 1,
                  marginBottom: "20px",
                  letterSpacing: "-0.04em",
                }}
              >
                {step.num}
              </div>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "10px",
                }}
              >
                {step.label}
              </div>
              <div style={{ fontSize: "14px", color: "#555", lineHeight: 1.7 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #111", position: "relative", zIndex: 1 }} />

      {/* Features grid */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
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
            Features
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Everything you need,
            <br />
            <span style={{ color: "#333" }}>nothing you don't.</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                background: hoveredFeature === i ? "#0a0a0a" : "#080808",
                border: `1px solid ${hoveredFeature === i ? "rgba(34,197,94,0.2)" : "#111"}`,
                borderRadius: "16px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                transition: "border-color 0.2s ease, background 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(34,197,94,0.06)",
                  border: "1px solid rgba(34,197,94,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {f.icon}
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                {f.title}
              </div>
              <div style={{ fontSize: "14px", color: "#555", lineHeight: 1.7 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
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
          Get 3LIXIR Loader.
          <br />
          <span style={{ color: "#333" }}>It's free.</span>
        </h2>
        <p style={{ fontSize: "17px", color: "#555", maxWidth: "420px", lineHeight: 1.7, margin: 0 }}>
          Download the app and have your first plugin installed in under a minute.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href="#"
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
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Download for Mac
          </a>
          <a
            href="#"
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
              textDecoration: "none",
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
            Download for PC
          </a>
        </div>
      </div>

        </div>{/* end brick inner */}
      </div>{/* end brick wrapper */}
    </div>
  );
}
