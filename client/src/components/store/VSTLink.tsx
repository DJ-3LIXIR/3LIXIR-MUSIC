// client/src/components/store/VSTLink.tsx
import { Link } from "wouter";

export default function VSTLink() {
  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        padding: "80px 0",
        borderTop: "1px solid #0d0d0d",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {/* Text Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#22d3ee",
            }}
          >
            New Release
          </div>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            VST Plugins
            <br />
            <span style={{ color: "#444" }}>Your Sound.</span>
          </h2>

          <p
            style={{
              fontSize: "15px",
              color: "#555",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "400px",
            }}
          >
            {/* Swap this copy for your actual description */}
            Professional-grade synthesizers and plugins designed for producers.
            Instant download. Compatible with all major DAWs.
          </p>

          {/* Tags */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Synth", "DAW Ready", "Instant DL", "Pro Grade"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#444",
                  border: "1px solid #222",
                  borderRadius: "100px",
                  padding: "4px 12px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <Link href="/vst">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "8px",
                padding: "14px 28px",
                background: "transparent",
                color: "#22d3ee",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                borderRadius: "100px",
                border: "1px solid #22d3ee",
                cursor: "pointer",
                transition: "background 0.2s ease, color 0.2s ease",
                width: "fit-content",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#22d3ee";
                (e.currentTarget as HTMLElement).style.color = "#000";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#22d3ee";
              }}
            >
              Browse Plugins
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Image Right */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#111",
            border: "1px solid #1a1a1a",
          }}
        >
          {/* Placeholder — swap src for your actual VST image */}
          <img
            src="/placeholder-vst.jpg"
            alt="VST Plugin"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Fallback placeholder UI */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              background: "linear-gradient(135deg, #0a1a1a 0%, #111 100%)",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="14" width="32" height="20" rx="4" stroke="#1a3a3a" strokeWidth="2" />
              <circle cx="16" cy="24" r="3" stroke="#1a3a3a" strokeWidth="2" />
              <circle cx="24" cy="24" r="3" stroke="#1a3a3a" strokeWidth="2" />
              <circle cx="32" cy="24" r="3" stroke="#1a3a3a" strokeWidth="2" />
              <path d="M12 34v4M24 34v4M36 34v4" stroke="#1a3a3a" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: "12px", color: "#1a3a3a", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              VST Image
            </span>
          </div>

          {/* Cyan corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "60px",
              height: "60px",
              borderTop: "2px solid #22d3ee",
              borderLeft: "2px solid #22d3ee",
              borderTopLeftRadius: "16px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "60px",
              height: "60px",
              borderBottom: "2px solid #22d3ee",
              borderRight: "2px solid #22d3ee",
              borderBottomRightRadius: "16px",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}