// frontend/src/pages/Store.tsx
import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";

const categories = [
  {
    id: "beats",
    label: "Beats & Licenses",
    href: "/beats",
    description: "Premium trap, drill, and custom beats. Exclusive & non-exclusive licenses available.",
    tag: "Most Popular",
    accent: "#a855f7",
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="19" r="10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19" cy="19" r="3.5" fill="currentColor" />
        <path d="M19 4v4M19 30v4M4 19h4M30 19h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 12l2-2M12 24l-2 2M26 26l-2-2M12 12l-2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    items: ["Non-Exclusive Lease", "Exclusive License", "Track Outs / Stems", "Custom Beats"],
  },
  {
    id: "downloads",
    label: "Digital Downloads",
    href: "/downloads",
    description: "Instantly download purchased files — stems, tracked-out beats, and sample packs.",
    tag: "Instant Access",
    accent: "#22d3ee",
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <rect x="6" y="28" width="26" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M19 6v18M12 17l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    items: ["Stem Packs", "Sample Kits", "Beat Files", "Project Files"],
  },
  {
    id: "shop",
    label: "Merch & Physical",
    href: "/shop",
    description: "Limited drops. Branded gear, apparel, and physical collectibles.",
    tag: "Limited Drop",
    accent: "#f97316",
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <path d="M10 14h18l-2 14H12L10 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="15" cy="30" r="1.5" fill="currentColor" />
        <circle cx="23" cy="30" r="1.5" fill="currentColor" />
      </svg>
    ),
    items: ["Hoodies & Tees", "Hats & Accessories", "Limited Editions", "Bundles"],
  },
];

export default function Store() {
  const [hovered, setHovered] = useState<string | null>(null);

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
          background: "radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ paddingTop: "96px", paddingBottom: "64px", textAlign: "center" }}>
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
            Official Store
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
            Everything
            <br />
            <span style={{ color: "#555" }}>In One Place.</span>
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
            Beats, licenses, digital downloads, and exclusive merch — all under one roof.
          </p>
        </div>

        {/* Category Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2px",
            background: "#111",
            border: "1px solid #1a1a1a",
            borderRadius: "20px",
            overflow: "hidden",
            marginBottom: "80px",
          }}
        >
          {categories.map((cat) => {
            const isHovered = hovered === cat.id;
            return (
              <Link key={cat.id} href={cat.href}>
                <div
                  onMouseEnter={() => setHovered(cat.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    padding: "40px 36px",
                    background: isHovered ? "#0d0d0d" : "#000",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    borderRight: "1px solid #111",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Accent glow on hover */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-60px",
                      left: "-20px",
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${cat.accent}18 0%, transparent 70%)`,
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.4s ease",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Tag */}
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: cat.accent,
                      marginBottom: "24px",
                    }}
                  >
                    {cat.tag}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      color: isHovered ? cat.accent : "#444",
                      marginBottom: "20px",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {cat.icon}
                  </div>

                  {/* Label */}
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      margin: "0 0 10px",
                      color: isHovered ? "#fff" : "#e0e0e0",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {cat.label}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      lineHeight: 1.6,
                      margin: "0 0 28px",
                    }}
                  >
                    {cat.description}
                  </p>

                  {/* Item list */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {cat.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontSize: "13px",
                          color: "#444",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: cat.accent, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: isHovered ? cat.accent : "#444",
                      transition: "color 0.2s ease",
                    }}
                  >
                    Browse {cat.label}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style={{
                        transform: isHovered ? "translateX(4px)" : "translateX(0)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom strip */}
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
            Secure checkout · Instant delivery · Licensed content
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { label: "Licenses", href: "/licenses" },
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
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#444")}
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