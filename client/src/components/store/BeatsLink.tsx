// client/src/components/store/BeatsLink.tsx
import { Link } from "wouter";

export default function BeatsLink() {
  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        padding: "80px 0",
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
          {/* Placeholder — swap src for your actual beat image */}
          <img
            src="/Gemini_Generated_Image_af4eezaf4eezaf4e.png"
            alt="Beats"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              // Fallback if image not found
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
              gap: "12px",
              background: "linear-gradient(135deg, #111 0%, #1a1a1a 100%)",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="13" stroke="#333" strokeWidth="2" />
              <circle cx="24" cy="24" r="4" fill="#333" />
              <path d="M24 5v5M24 38v5M5 24h5M38 24h5" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: "12px", color: "#333", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Beat Image
            </span>
          </div>

          {/* Gold corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "60px",
              height: "60px",
              borderTop: "2px solid #C9A84C",
              borderLeft: "2px solid #C9A84C",
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
              borderBottom: "2px solid #C9A84C",
              borderRight: "2px solid #C9A84C",
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
              color: "#C9A84C",
            }}
          >
            Featured
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
            Premium Beats
            <br />
            <span style={{ color: "#444" }}>Built to Hit.</span>
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
            Trap, drill, and custom production. Non-exclusive leases, exclusive
            licenses, and full track outs available for every level.
          </p>

          {/* Tags */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Trap", "Drill", "Custom", "Exclusive"].map((tag) => (
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

          <Link href="/beats">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "8px",
                padding: "14px 28px",
                background: "#C9A84C",
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
              Browse Beats
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}