// client/src/pages/apollo.tsx
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
        <path d="M14 4l10 6v8l-10 6L4 18v-8l10-6z" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 4v16M4 10l10 6 10-6" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Feature One",
    desc: "Describe the first key feature of Apollo here. What makes it powerful for producers?",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="20" height="16" rx="3" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M9 12h10M9 16h6" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Feature Two",
    desc: "Describe the second key feature of Apollo here. What workflow does it unlock?",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4a10 10 0 1 1 0 20A10 10 0 0 1 14 4z" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M14 9v5l3 3" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Feature Three",
    desc: "Describe the third key feature of Apollo here. What sets it apart from everything else?",
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
    desc: "Describe the fourth key feature of Apollo here.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="4" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M10 14l3 3 5-5" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Feature Five",
    desc: "Describe the fifth key feature of Apollo here.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#C9A84C" strokeWidth="1.8" />
        <path d="M14 9v2M14 17v2M9 14h2M17 14h2" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Feature Six",
    desc: "Describe the sixth key feature of Apollo here.",
  },
];

const steps = [
  { num: "01", label: "Step One", desc: "Describe the first step to get started with Apollo." },
  { num: "02", label: "Step Two", desc: "Describe the second step in the Apollo workflow." },
  { num: "03", label: "Step Three", desc: "Describe the third step — what the user gets at the end." },
];

export default function Apollo() {
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
        (p.name || p.title || "").trim().toLowerCase().includes("apollo")
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
      title: plugin.name || plugin.title || "Apollo",
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

      {/* Hero product image banner */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundImage: 'url("/Product box for APOLLO.png")',
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
            Apollo
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
              3LIXIR MUSIC APOLLO ROOM AND REVERB SIMULATOR
            </div>

            {/* Reverb Interface - image left, text right */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "32px",
                textAlign: "left",
              }}
            >
              <div style={{ flex: "1 1 55%" }}>
                <img
                  src="/Apollo Reverb.png"
                  alt="Apollo Reverb Interface"
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
                    color: "#C9A84C",
                    marginBottom: "12px",
                  }}
                >
                  Reverb Engine
                </div>
                <h2
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    margin: "0 0 12px 0",
                    lineHeight: 1.2,
                  }}
                >
                  Shape your space
                  <br />
                  <span style={{ color: "#C9A84C" }}>with precision.</span>
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#888",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  Apollo's reverb engine features a graphic EQ, adjustable attack, size, density, decay, distance, and predelay controls with independent dry/wet mixing for studio-quality spatial effects.
                </p>
              </div>
            </div>

            {/* Room Simulator - text left, image right */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "32px",
                textAlign: "left",
              }}
            >
              <div style={{ flex: "1 1 45%" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#C9A84C",
                    marginBottom: "12px",
                  }}
                >
                  Room Simulator
                </div>
                <h2
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    margin: "0 0 12px 0",
                    lineHeight: 1.2,
                  }}
                >
                  Real-world rooms,
                  <br />
                  <span style={{ color: "#C9A84C" }}>at your fingertips.</span>
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#888",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  Place your sound in theaters, churches, studios, halls, garages, and more. Full control over room size, absorption, diffusion, pre-delay, decay, width, and early/late reflections.
                </p>
              </div>
              <div style={{ flex: "1 1 55%" }}>
                <img
                  src="/Apollo Room .png"
                  alt="Apollo Room Simulator"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "12px",
                  }}
                />
              </div>
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
              Apollo
              <br />
              <span style={{ color: "#333" }}>Any space,</span>
              <br />
              <span style={{ color: "#C9A84C" }}>in your mix.</span>
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
              Apollo is a room and reverb simulator that puts real acoustic spaces inside your DAW. Shape studio-quality reverb with full control over size, decay, EQ, and modulation, or drop your sound into a theater, church, hall, or studio — then fine-tune every reflection.
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
                Get Apollo
              </button>

              <button
                onClick={scrollToDetails}
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

            <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>
              VST3 &amp; AU · macOS &amp; Windows
            </p>
          </div>

          {/* Reverb EQ - image left, text right */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              padding: "40px 24px 20px",
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <div style={{ flex: "1 1 55%" }}>
              <img
                src="/APOLLO reverb eq.png"
                alt="Apollo Reverb EQ"
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
                  color: "#C9A84C",
                  marginBottom: "12px",
                }}
              >
                Output EQ & Modulation
              </div>
              <h2
                style={{
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: "0 0 12px 0",
                  lineHeight: 1.2,
                }}
              >
                Fine-tune your reverb
                <br />
                <span style={{ color: "#C9A84C" }}>with surgical detail.</span>
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#888",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Apollo's detailed view gives you a full output EQ curve with modulation controls for quality, mod speed, mod depth, smoothing, early/late balance, width, and mono maker — total command over your reverb tail.
              </p>
            </div>
          </div>

          {/* Room Sim Church - text left, image right */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              padding: "20px 24px 40px",
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <div style={{ flex: "1 1 45%" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: "12px",
                }}
              >
                Room Simulation
              </div>
              <h2
                style={{
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: "0 0 12px 0",
                  lineHeight: 1.2,
                }}
              >
                Authentic spaces,
                <br />
                <span style={{ color: "#C9A84C" }}>captured in detail.</span>
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#888",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                From grand churches to intimate studios — dial in room size, absorption, diffusion, pre-delay, decay, and width to place your sound in any environment with photorealistic accuracy.
              </p>
            </div>
            <div style={{ flex: "1 1 55%" }}>
              <img
                src="/APOLLO room 2.png"
                alt="Apollo Room Simulator - Church"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px",
                }}
              />
            </div>
          </div>

          {/* Reverb Presets - image left, text right */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              padding: "40px 24px 20px",
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <div style={{ flex: "1 1 55%" }}>
              <img
                src="/APOLLO reverb presets .png"
                alt="Apollo Reverb Presets"
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
                  color: "#C9A84C",
                  marginBottom: "12px",
                }}
              >
                Reverb Presets
              </div>
              <h2
                style={{
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: "0 0 12px 0",
                  lineHeight: 1.2,
                }}
              >
                Ready-made spaces,
                <br />
                <span style={{ color: "#C9A84C" }}>built by professionals.</span>
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#888",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Browse factory presets across small rooms, halls, theaters, plates & digital, creative, vocals, and ambient/FX categories. Instant inspiration with one click — then tweak to taste.
              </p>
            </div>
          </div>

          {/* Room Sim Presets - text left, image right */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              padding: "20px 24px 40px",
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <div style={{ flex: "1 1 45%" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: "12px",
                }}
              >
                Room Presets
              </div>
              <h2
                style={{
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: "0 0 12px 0",
                  lineHeight: 1.2,
                }}
              >
                Every room you need,
                <br />
                <span style={{ color: "#C9A84C" }}>already dialed in.</span>
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#888",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Theater, church, studio, hall, garage, bathroom, bedroom, warehouse — each with curated sub-presets. Select a space, choose a variation, and drop straight into a mix-ready room simulation.
              </p>
            </div>
            <div style={{ flex: "1 1 55%" }}>
              <img
                src="/APOLLO room presets .png"
                alt="Apollo Room Presets"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px",
                }}
              />
            </div>
          </div>

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
                color: "#C9A84C",
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
              Every space,
              <br />
              <span style={{ color: "#C9A84C" }}>brought to light.</span>
            </h2>
            <p style={{ fontSize: "16px", color: "#999", lineHeight: 1.9, margin: 0 }}>
              From the vaulted stone of an ancient temple to the hush of a modern
              studio, every space has a voice — and Apollo captures them all.
              Built from the ground up in C++, it drops real acoustic rooms
              straight into your DAW: shape size, density, decay, distance,
              pre-delay, EQ, and modulation, and sculpt early and late reflections
              by hand to place your sound anywhere from a grand cathedral to an
              intimate booth.
            </p>
            <p style={{ fontSize: "16px", color: "#999", lineHeight: 1.9, margin: 0 }}>
              A full factory library of reverb and room presets means a finished,
              mix-ready space is always one click away. And Apollo shines
              brightest alongside Hades and Orion in the 3LIXIR Olympus suite —
              grab all three in the Olympus Bundle and save 15%.
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
              Get Apollo.
              <br />
              <span style={{ color: "#C9A84C" }}>Give your sound a space.</span>
            </h2>
            <p style={{ fontSize: "17px", color: "#888", maxWidth: "440px", lineHeight: 1.7, margin: 0 }}>
              Studio-grade reverb and true room simulation in one plugin. Grab your copy of Apollo and place your sound anywhere.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={handleGet}
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
                Get Apollo
              </button>
              <button
                onClick={scrollToDetails}
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
                  color: "#C9A84C",
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
                <span style={{ color: "#C9A84C" }}>in three steps.</span>
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
                { num: "02", label: "Purchase Apollo", desc: "Buy Apollo right here. Your license is added to your 3LIXIR account the moment checkout completes." },
                { num: "03", label: "Sign in & install", desc: "Open the Loader, log into your 3LIXIR account, and Apollo is ready to install to your DAW with a single click." },
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
                      color: "rgba(201,168,76,0.14)",
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
                color: "#C9A84C",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Technical Details
            </div>
            <div
              style={{
                border: "1px solid rgba(201,168,76,0.2)",
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
                ["Type", "Reverb & room simulator"],
                ["Features", "Reverb engine, room simulator, output EQ, modulation, early/late reflections"],
                ["Presets", "Factory reverb & room presets across every category"],
                ["Bundle", "Olympus Bundle — with Hades & Orion, save 15%"],
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
                        ? "1px solid rgba(201,168,76,0.1)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#C9A84C",
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
