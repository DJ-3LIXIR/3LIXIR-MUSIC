// client/src/pages/VST.tsx
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { supabase } from "@/supabaseClient";

interface Plugin {
  id: string | number;
  name: string;
  category: string;
  tag: string | null;
  price: string;
  url: string | null;
  image: string | null;
}

const navItems = ["All", "Instruments", "Audio Units", "Libraries"];

export default function VST() {
  const [activeTab, setActiveTab] = useState("All");
  const [hoveredPlugin, setHoveredPlugin] = useState<string | number | null>(null);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlugins = async () => {
      const { data, error } = await supabase
        .from("plugins")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        return;
      }

      const mapped: Plugin[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name || item.title || "Unknown",
        category: item.category || "Instruments",
        tag: item.tag || null,
        price: item.price
          ? typeof item.price === "number"
            ? `$${item.price}`
            : String(item.price)
          : item.price_usd
          ? `$${item.price_usd}`
          : "$0",
        url: item.url || item.product_url || item.link || null,
        image: item.image || item.image_url || item.thumbnail || null,
      }));

      setPlugins(mapped);
      setLoading(false);
    };

    fetchPlugins();
  }, []);

  const normalizeCategory = (str: string) => str.toLowerCase().trim().replace(/s$/, "");
  const filtered = activeTab === "All"
    ? plugins
    : plugins.filter(p => normalizeCategory(p.category) === normalizeCategory(activeTab));

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

      {/* Hero - Product Box Display */}
      <div
        style={{
          position: "relative",
          background: "radial-gradient(ellipse at 50% 0%, #0a0a0a 0%, #000 70%)",
          paddingTop: "100px",
          paddingBottom: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Page title */}
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#C9A84C",
            marginBottom: "16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          3LIXIR VST Plugins
        </div>

        {/* Product Box Placeholder */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "280px",
            height: "360px",
            marginBottom: "0",
            filter: "drop-shadow(0 40px 80px rgba(201,168,76,0.2))",
          }}
        >
          {/* Box face */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(145deg, #111 0%, #0a0a0a 100%)",
              borderRadius: "8px",
              border: "1px solid rgba(201,168,76,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Inner glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.06) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />

            {/* Decorative circle */}
            <div
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "1px solid rgba(201,168,76,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Waveform icon */}
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                  <path d="M0 20h8M8 20V8l4 24 4-32 4 28 4-20 4 16 4-24 4 32 4-20 4 16 4-12 4 8M52 20h8" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                </svg>
              </div>
            </div>

            {/* Product name */}
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                3LIXIR
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginTop: "6px",
                }}
              >
                Plugin Suite
              </div>
            </div>

            {/* Bottom brand strip */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "44px",
                background: "rgba(201,168,76,0.08)",
                borderTop: "1px solid rgba(201,168,76,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  opacity: 0.7,
                }}
              >
                3LIXIR MUSIC
              </span>
            </div>

            {/* Gold corner accents */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "40px", height: "40px", borderTop: "2px solid #C9A84C", borderLeft: "2px solid #C9A84C", borderTopLeftRadius: "8px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, right: 0, width: "40px", height: "40px", borderTop: "2px solid #C9A84C", borderRight: "2px solid #C9A84C", borderTopRightRadius: "8px", pointerEvents: "none" }} />
          </div>

          {/* Box spine shadow */}
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "10%",
              right: "10%",
              height: "20px",
              background: "radial-gradient(ellipse, rgba(201,168,76,0.15) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
        </div>

        {/* Fade bottom */}
        <div
          style={{
            width: "100%",
            height: "80px",
            background: "linear-gradient(to bottom, transparent, #000)",
            marginTop: "-20px",
            position: "relative",
            zIndex: 2,
          }}
        />
      </div>

      {/* Gold Sub-Navbar - Full Width */}
      <div
        style={{
          borderTop: "1px solid #C9A84C",
          borderBottom: "1px solid #C9A84C",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
          width: "100%",
          position: "sticky",
          top: "80px",
          zIndex: 10,
        }}
      >
        {navItems.map((item, index) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            style={{
              padding: "16px 56px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: activeTab === item ? "#000" : "#C9A84C",
              background: activeTab === item ? "#C9A84C" : "transparent",
              cursor: "pointer",
              borderLeft: index !== 0 ? "1px solid rgba(201,168,76,0.2)" : "none",
              border: "none",
              transition: "background 0.2s ease, color 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== item) {
                (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.07)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== item) {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Plugin Grid - Mirrored brick background like Downloads page */}
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

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "60px 24px 100px",
          }}
        >
        {/* Grid header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <span style={{ fontSize: "13px", color: "#444" }}>
            {loading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid rgba(201,168,76,0.2)",
                borderTop: "2px solid #C9A84C",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Grid */}
        {!loading && <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((plugin) => {
            const isHovered = hoveredPlugin === plugin.id;
            return (
              <div
                key={plugin.id}
                onMouseEnter={() => setHoveredPlugin(plugin.id)}
                onMouseLeave={() => setHoveredPlugin(null)}
                onClick={() => plugin.url && window.open(plugin.url, "_blank", "noopener,noreferrer")}
                style={{
                  background: isHovered ? "#0d0d0d" : "#080808",
                  border: `1px solid ${isHovered ? "rgba(201,168,76,0.3)" : "#111"}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: plugin.url ? "pointer" : "default",
                  transition: "border-color 0.2s ease, background 0.2s ease",
                  position: "relative",
                }}
              >
                {/* Tag */}
                {plugin.tag && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: plugin.tag === "Sale" ? "#f97316" : plugin.tag === "New" ? "#22d3ee" : "#C9A84C",
                      background: plugin.tag === "Sale" ? "rgba(249,115,22,0.1)" : plugin.tag === "New" ? "rgba(34,211,238,0.1)" : "rgba(201,168,76,0.1)",
                      border: `1px solid ${plugin.tag === "Sale" ? "rgba(249,115,22,0.3)" : plugin.tag === "New" ? "rgba(34,211,238,0.3)" : "rgba(201,168,76,0.3)"}`,
                      borderRadius: "100px",
                      padding: "3px 10px",
                      zIndex: 1,
                    }}
                  >
                    {plugin.tag}
                  </div>
                )}

                {/* Image */}
                <div
                  style={{
                    aspectRatio: "4/3",
                    background: "linear-gradient(135deg, #0d0d0d 0%, #111 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid #111",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: isHovered ? "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)" : "transparent",
                      transition: "background 0.3s ease",
                      zIndex: 1,
                    }}
                  />
                  {plugin.image ? (
                    <img
                      src={plugin.image}
                      alt={plugin.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.4s ease",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                      }}
                    />
                  ) : (
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect x="6" y="12" width="28" height="16" rx="3" stroke="#222" strokeWidth="1.5" />
                      <circle cx="13" cy="20" r="3" stroke="#222" strokeWidth="1.5" />
                      <circle cx="20" cy="20" r="3" stroke="#222" strokeWidth="1.5" />
                      <circle cx="27" cy="20" r="3" stroke="#222" strokeWidth="1.5" />
                      <path d="M10 28v4M20 28v4M30 28v4" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#444",
                      marginBottom: "6px",
                    }}
                  >
                    {plugin.category}
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: isHovered ? "#fff" : "#ccc",
                      transition: "color 0.2s ease",
                      marginBottom: "12px",
                    }}
                  >
                    {plugin.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "#C9A84C",
                      }}
                    >
                      {plugin.price}
                    </span>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: isHovered ? "#000" : "#C9A84C",
                        background: isHovered ? "#C9A84C" : "transparent",
                        border: "1px solid rgba(201,168,76,0.4)",
                        borderRadius: "100px",
                        padding: "5px 14px",
                        transition: "background 0.2s ease, color 0.2s ease",
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>}
      </div>
      </div>
    </div>
  );
}