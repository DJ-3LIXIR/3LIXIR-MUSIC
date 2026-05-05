import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";

export default function Merchandise() {
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

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
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
            Official Merchandise
          </div>

          <h1
            style={{
              fontSize: "clamp(42px, 7vw, 80px)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              margin: "0 0 20px",
            }}
          >
            Wear The
            <br />
            <span style={{ color: "#555" }}>3LIXIR Vision.</span>
          </h1>

          <p
            style={{
              fontSize: "17px",
              color: "#666",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Premium apparel and limited drops for producers and artists who build with intent.
          </p>
        </div>
      </div>

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
          { label: "Merchandise", href: "/merchandise" },
          { label: "Plugin Installer", href: "/loader" },
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

      <div style={{ position: "relative", minHeight: "420px" }}>
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

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "80px 24px 100px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(30px, 5vw, 54px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Merchandise Collection
          </h2>
          <p
            style={{
              margin: "18px auto 34px",
              maxWidth: "620px",
              color: "#b9b9b9",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            Explore current drops, seasonal capsules, and artist-first essentials.
          </p>

          <div
            style={{
              display: "inline-block",
              marginBottom: "14px",
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(201,168,76,0.45)",
              background: "rgba(201,168,76,0.08)",
              color: "#e8c76a",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Coming Soon
          </div>

          <br />

          <Link href="/shop">
            <button
              style={{
                padding: "14px 28px",
                borderRadius: "999px",
                border: "1px solid #C9A84C",
                background: "rgba(201,168,76,0.12)",
                color: "#f5d889",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Open Merchandise Store
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
