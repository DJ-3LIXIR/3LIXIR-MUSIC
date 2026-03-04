// client/src/pages/Store.tsx
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import BeatsLink from "@/components/store/BeatsLink";
import VSTLink from "@/components/store/VSTLink";

export default function Store() {
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

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
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
          { label: "Miscellaneous", href: "/shop" },
        ].map((item, index) => (
          <Link key={item.href} href={item.href}>
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

      {/* Embedded Store Components */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <BeatsLink />
        <VSTLink />
      </div>

      {/* Bottom strip */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
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