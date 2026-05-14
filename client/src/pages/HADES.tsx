// client/src/pages/HADES.tsx
import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l10 6v8l-10 6L4 18v-8l10-6z" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 4v16M4 10l10 6 10-6" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Feature One",
    desc: "Describe the first key feature of Hades here. What makes it powerful for producers?",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="20" height="16" rx="3" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M9 12h10M9 16h6" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Feature Two",
    desc: "Describe the second key feature of Hades here. What workflow does it unlock?",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4a10 10 0 1 1 0 20A10 10 0 0 1 14 4z" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M14 9v5l3 3" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Feature Three",
    desc: "Describe the third key feature of Hades here. What sets it apart from everything else?",
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
    desc: "Describe the fourth key feature of Hades here.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="4" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M10 14l3 3 5-5" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Feature Five",
    desc: "Describe the fifth key feature of Hades here.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M14 9v2M14 17v2M9 14h2M17 14h2" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Feature Six",
    desc: "Describe the sixth key feature of Hades here.",
  },
];

const steps = [
  { num: "01", label: "Step One", desc: "Describe the first step to get started with Hades." },
  { num: "02", label: "Step Two", desc: "Describe the second step in the Hades workflow." },
  { num: "03", label: "Step Three", desc: "Describe the third step — what the user gets at the end." },
];

export default function Hades() {
  const isMobile = useIsMobile();
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
          backgroundImage: 'url("/Hades Product image.png")',
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
            Hades
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
              3LIXIR Hades
            </div>

            {/* Product Image */}
            <img
              src="/HADES GUITAR.png"
              alt="Hades Guitar"
              style={{
                width: "100%",
                maxWidth: "500px",
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
              Hades
              <br />
              <span style={{ color: "#333" }}>Your tagline.</span>
              <br />
              <span style={{ color: "#C9A84C" }}>Goes here.</span>
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
              Add your Hades product description here. Tell producers what it is and why they need it.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
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
                Get Hades
              </button>

              <button
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

            <p style={{ fontSize: "12px", color: "#333", margin: 0 }}>
              Add version info or compatibility details here
            </p>
          </div>

          {/* Hades Bass - centered */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "900px",
              margin: "0 auto",
              padding: "80px 24px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "24px",
            }}
          >
            <img
              src="/HADES BASS.png"
              alt="Hades Bass"
              style={{
                width: "100%",
                maxWidth: "700px",
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
              Hades Bass
            </div>
            <h3
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Thunderous low end
              <br />
              <span style={{ color: "#C9A84C" }}>built for heavy tones.</span>
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: "#888",
                lineHeight: 1.8,
                margin: 0,
                maxWidth: "520px",
              }}
            >
              Hades Bass delivers crushing bass tones with deep saturation and tight response. Dial in your sound with built-in presets designed for every style of heavy music.
            </p>
          </div>

          {/* Hades Cabinet - centered */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "900px",
              margin: "0 auto",
              padding: "80px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "24px",
            }}
          >
            <img
              src="/HADES CABINET.png"
              alt="Hades Cabinet"
              style={{
                width: "100%",
                maxWidth: "700px",
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
              Hades Cabinet
            </div>
            <h3
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Shape your tone
              <br />
              <span style={{ color: "#C9A84C" }}>with cabinet emulation.</span>
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: "#888",
                lineHeight: 1.8,
                margin: 0,
                maxWidth: "520px",
              }}
            >
              The Hades Cabinet simulator gives you authentic speaker response and room character. Browse through presets to find the perfect cab pairing for your guitar and bass tones.
            </p>
          </div>

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
              Get Hades.
              <br />
              <span style={{ color: "#333" }}>Your tagline.</span>
            </h2>
            <p style={{ fontSize: "17px", color: "#555", maxWidth: "420px", lineHeight: 1.7, margin: 0 }}>
              Add your bottom CTA description here. Drive the user to take action.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
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
                Get Hades
              </button>
              <button
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

        </div>{/* end brick inner */}
      </div>{/* end brick wrapper */}
    </div>
  );
}
