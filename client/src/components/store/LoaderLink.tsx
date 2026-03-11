// client/src/components/store/LoaderLink.tsx
import { Link } from "wouter";

export default function LoaderLink() {
  return (
    <div
      style={{
        background: "transparent",
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
        {/* Image Left */}
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
          <img
            src="/3lixir-loader.png"
            alt="3LIXIR Loader"
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
              zIndex: -1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              background: "linear-gradient(135deg, #0a150a 0%, #111 100%)",
            }}
          >
            {/* Download / app icon */}
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <rect x="6" y="6" width="40" height="40" rx="10" stroke="#1a3a1a" strokeWidth="2" />
              <path d="M26 16v14M26 30l-6-6M26 30l6-6" stroke="#1a3a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 38h20" stroke="#1a3a1a" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span
              style={{
                fontSize: "11px",
                color: "#1a3a1a",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              3LIXIR Loader
            </span>
          </div>

          {/* Green corner accents */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "60px",
              height: "60px",
              borderTop: "2px solid #22c55e",
              borderLeft: "2px solid #22c55e",
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
              borderBottom: "2px solid #22c55e",
              borderRight: "2px solid #22c55e",
              borderBottomRightRadius: "16px",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Text Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#22c55e",
            }}
          >
            Official App
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
            3LIXIR Loader
            <br />
            <span style={{ color: "#444" }}>Your Plugins. One Click.</span>
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
            The official plugin downloader for 3LIXIR MUSIC. Install, manage,
            and update your VST plugins automatically — no manual installs, no
            hassle.
          </p>

          {/* Tags */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Free", "Mac & PC", "Auto-Update", "Plugin Manager"].map((tag) => (
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

          <Link href="/loader">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "8px",
                padding: "14px 28px",
                background: "#22c55e",
                color: "#000",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                borderRadius: "100px",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
                width: "fit-content",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              Download App
              {/* Download arrow icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v7M7 9l-3-3M7 9l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
