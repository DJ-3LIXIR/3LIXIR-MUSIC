// client/src/pages/Tools.tsx
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import ToolLink from "@/components/tools/ToolLink";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Tools() {
  const isMobile = useIsMobile();

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

      {/* Ambient glow top */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            paddingTop: "96px",
            paddingBottom: "64px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#a855f7",
              border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: "100px",
              padding: "5px 16px",
              marginBottom: "28px",
            }}
          >
            Audio Tools
          </div>

          <h1
            style={{
              fontSize: "clamp(42px, 7vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              margin: "0 0 20px",
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
            }}
          >
            Producer Tools
            <br />
            <span style={{ color: "#555" }}>Free To Use.</span>
          </h1>

          <p
            style={{
              fontSize: "17px",
              color: "#666",
              maxWidth: "460px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Convert, sample, and split audio — a growing suite of free tools
            built for the modern producer.
          </p>
        </div>
      </div>

      {/* Tools Sub-Navbar - Full Width */}
      <div
        style={{
          borderTop: "1px solid #C9A84C",
          borderBottom: "1px solid #C9A84C",
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, minmax(0, 1fr))"
            : "repeat(3, minmax(0, 1fr))",
          alignItems: "stretch",
          background: "#000",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[
          { label: "Video Converter", href: "/tools/video-converter" },
          { label: "Sample Generator", href: "/tools/sample-generator" },
          { label: "Stem Splitter", href: "/tools" },
        ].map((item, index) => (
          <Link key={item.label} href={item.href}>
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
                  !isMobile && index !== 0
                    ? "1px solid rgba(201,168,76,0.2)"
                    : "none",
                borderTop:
                  isMobile && index >= 2
                    ? "1px solid rgba(201,168,76,0.2)"
                    : "none",
                borderRight:
                  isMobile && index % 2 === 0
                    ? "1px solid rgba(201,168,76,0.2)"
                    : "none",
                transition: "background 0.2s ease, color 0.2s ease",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(201,168,76,0.07)";
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

      {/* Embedded Tool Components - Mirrored brick background */}
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
          <ToolLink
            badge="Live Now"
            title="Video Converter"
            titleAccent="Any Link."
            description="Paste a YouTube link or any video URL and pull it down as clean audio or video. MP3, WAV, MP4 and more."
            tags={["YouTube", "MP3 / WAV", "Instant", "Free"]}
            ctaLabel="Open Converter"
            href="/tools/video-converter"
            accent="#22d3ee"
            imageSrc="/video-converter.png"
            imagePlaceholderLabel="Converter"
            icon={
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect
                  x="6"
                  y="12"
                  width="36"
                  height="24"
                  rx="4"
                  stroke="#22d3ee"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                />
                <path
                  d="M20 19l9 5-9 5V19z"
                  stroke="#22d3ee"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <ToolLink
            reverse
            badge="Live Now"
            title="Sample Digger"
            titleAccent="Dig for Gold."
            description="Crate-dig random records with full Discogs metadata — filter by genre, era, and region, play them inline, and build a queue."
            tags={["Crate Dig", "Discogs", "Filter", "Producer"]}
            ctaLabel="Open Digger"
            href="/tools/sample-generator"
            accent="#a855f7"
            imageSrc="/sample-digger.png"
            imagePlaceholderLabel="Sampler"
            icon={
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M8 24h4l3-10 6 20 4-14 3 8h12"
                  stroke="#a855f7"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <ToolLink
            comingSoon
            badge="Coming Soon"
            title="Stem Splitter"
            titleAccent="Vocals, Drums, Bass."
            description="AI-powered separation into clean stems — vocals, instrumental, and more. Real isolation, landing once we bring the AI engine online."
            tags={["Vocals", "Instrumental", "AI", "Soon"]}
            ctaLabel="Coming Soon"
            href="/tools"
            accent="#C9A84C"
            imageSrc="/stem-splitter.png"
            imagePlaceholderLabel="Splitter"
            icon={
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 8v10M24 30v10M14 24h20"
                  stroke="#C9A84C"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="6"
                  stroke="#C9A84C"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Bottom strip */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            borderTop: "1px solid #111",
            paddingTop: "40px",
            paddingBottom: "60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#333", margin: 0 }}>
            Free tools · No sign-up · More on the way
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { label: "Store", href: "/store" },
              { label: "VIP", href: "/vip" },
              { label: "Support", href: "/support" },
            ].map((l) => (
              <Link key={l.href} href={l.href}>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#444",
                    cursor: "pointer",
                    transition: "color 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#fff")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#444")
                  }
                >
                  {l.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
