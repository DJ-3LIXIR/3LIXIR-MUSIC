// client/src/pages/SampleGenerator.tsx
import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Search,
  SlidersHorizontal,
  Shuffle,
  Timer,
  Link2,
  Star,
  Sparkles,
  TrendingUp,
  MoreHorizontal,
  Play,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#e8c76a";

// Free daily "digs" (shuffles) for signed-in, non-member users.
const DAILY_FREE_LIMIT = 10;
const FREE_TIERS = ["tier_zero", "black", ""];

// NOTE: Client-side counter is a UX layer only — real quota is enforced
// server-side once the backend/data source is wired in.
function usageKey(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  return `sg_usage_${userId}_${today}`;
}
function getUsedToday(userId: string): number {
  try {
    return parseInt(localStorage.getItem(usageKey(userId)) || "0", 10) || 0;
  } catch {
    return 0;
  }
}
function incrementUsage(userId: string): void {
  try {
    localStorage.setItem(usageKey(userId), String(getUsedToday(userId) + 1));
  } catch {
    /* ignore */
  }
}

// Placeholder "currently digging" track. Real data will come from the backend
// (Discogs / AcousticBrainz + YouTube) once wired in.
const TRACK = {
  fullTitle: "Hennes & Cold — Sound Of Rock (A*S*Y*S Remix) [HQ]",
  channel: "Electronic HQ",
  artist: "Hennes & Cold",
  release: "Sound Of Rock",
  year: "2001",
  views: "760",
  musicalKey: "G# Major",
  tempo: "141 BPM",
  genre: "Electronic",
  style: "Acid, Hard Trance",
  region: "Germany",
  label: "Tracid Traxxx",
};

export default function SampleGenerator() {
  const { user, userProfile, openAuthModal } = useAuth();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [usedToday, setUsedToday] = useState(() =>
    user ? getUsedToday(user.id) : 0
  );

  const tier = (
    userProfile?.subscription_tier ||
    user?.subscription_tier ||
    ""
  ).toLowerCase();
  const isMember = !!user && !FREE_TIERS.includes(tier);
  const remaining = Math.max(0, DAILY_FREE_LIMIT - usedToday);
  const limitReached = !!user && !isMember && remaining <= 0;

  const handleShuffle = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (limitReached) {
      setLocation("/vip");
      return;
    }
    // TODO: fetch a new random track from the backend here.
    if (!isMember) {
      incrementUsage(user.id);
      setUsedToday((n) => n + 1);
    }
  };

  const metaRows: [string, string, boolean?][] = [
    ["Artist", TRACK.artist],
    ["Release", TRACK.release],
    ["Year", TRACK.year],
    ["Channel", TRACK.channel, true],
    ["Views", TRACK.views],
    ["Key", TRACK.musicalKey],
    ["Tempo", TRACK.tempo],
    ["Genre", TRACK.genre],
    ["Style", TRACK.style],
    ["Region", TRACK.region],
    ["Label", TRACK.label],
  ];

  const card: React.CSSProperties = {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: "16px",
  };

  const iconBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "44px",
    minWidth: "52px",
    borderRadius: "10px",
    background: "#1a1a1a",
    border: "1px solid #262626",
    color: "#aaa",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* Brick-framed layout (matches the other tool pages) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "120px 2px 1fr 2px 120px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Left brick + divider */}
        {!isMobile && (
          <>
            <div
              style={{
                background: 'url("/black_gold_brick_texture.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "repeat",
                opacity: 0.55,
              }}
            />
            <div
              style={{
                background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
                width: "2px",
              }}
            />
          </>
        )}

        {/* Center content */}
        <div style={{ padding: "104px 40px 60px", minWidth: 0 }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link href="/tools">
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                ← Back
              </span>
            </Link>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Sample <span style={{ color: GOLD }}>Digger</span>
            </span>
          </div>

          {/* Usage / PRO chip */}
          {isMember ? (
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#000",
                background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                borderRadius: "100px",
                padding: "7px 16px",
              }}
            >
              ★ Member
            </span>
          ) : (
            <Link href="/vip">
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: GOLD,
                  border: `1px solid ${GOLD}55`,
                  borderRadius: "100px",
                  padding: "7px 16px",
                  cursor: "pointer",
                }}
              >
                {user
                  ? `${remaining} free digs left · Go Unlimited`
                  : "Sign in · 10 free digs / day"}
              </span>
            </Link>
          )}
        </div>

        {/* Workspace */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "340px 1fr 320px",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* LEFT — Metadata */}
          <div style={{ ...card, padding: "24px" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                lineHeight: 1.25,
                marginBottom: "20px",
              }}
            >
              Sound Of Rock (A*S*Y*S Remix)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {metaRows.map(([label, value, isLink]) => (
                <div
                  key={label}
                  style={{ display: "flex", fontSize: "14px", gap: "12px" }}
                >
                  <span style={{ width: "84px", color: "#666", flexShrink: 0 }}>
                    {label}
                  </span>
                  <span
                    style={{
                      color: isLink ? "#4a9eff" : "#eee",
                      fontWeight: 500,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: "22px",
                paddingTop: "18px",
                borderTop: "1px solid #1e1e1e",
                fontSize: "12px",
                color: "#555",
              }}
            >
              Data from{" "}
              <span style={{ color: "#4a9eff" }}>Discogs</span> and{" "}
              <span style={{ color: "#4a9eff" }}>AcousticBrainz</span>
            </div>
          </div>

          {/* CENTER — Player + controls */}
          <div>
            {/* Title row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "#1a1a1a",
                  border: "1px solid #262626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  color: GOLD,
                  flexShrink: 0,
                }}
              >
                S
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {TRACK.fullTitle}
                </div>
                <div style={{ fontSize: "13px", color: "#888" }}>
                  {TRACK.channel}
                </div>
              </div>
            </div>

            {/* Video */}
            <div
              style={{
                position: "relative",
                aspectRatio: "16 / 9",
                background: "#000",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid #1e1e1e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at center, #1a1a1a 0%, #000 80%)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  width: "68px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "#f00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Play size={24} color="#fff" fill="#fff" />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  fontSize: "13px",
                  color: "#ccc",
                  fontWeight: 600,
                }}
              >
                Watch on YouTube
              </div>
            </div>

            {/* Control bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              <div style={iconBtn} title="Search">
                <Search size={18} />
              </div>
              <div style={iconBtn} title="Filters">
                <SlidersHorizontal size={18} />
              </div>
              {/* Big shuffle / dig button */}
              <button
                onClick={handleShuffle}
                style={{
                  flex: 1,
                  height: "44px",
                  border: "none",
                  borderRadius: "10px",
                  background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                  color: "#000",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  boxShadow: `0 6px 20px ${GOLD}44`,
                }}
              >
                <Shuffle size={18} />
                {!user
                  ? "Sign In to Dig"
                  : limitReached
                    ? "Upgrade for Unlimited"
                    : "Dig — Random Track"}
              </button>
              <div style={iconBtn} title="Timer">
                <Timer size={18} />
              </div>
              <div style={iconBtn} title="Copy link">
                <Link2 size={18} />
              </div>
            </div>
          </div>

          {/* RIGHT — Queue */}
          <div style={{ ...card, padding: "14px" }}>
            {/* Now playing */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px",
                borderRadius: "12px",
                background: "#181818",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${GOLD}55, #222)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Play size={16} color={GOLD} fill={GOLD} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Sound Of Rock (A*S*Y*S…)
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  {TRACK.artist} · {TRACK.year}
                </div>
              </div>
              <Star size={16} color="#666" />
              <MoreHorizontal size={16} color="#666" />
            </div>

            {/* Queue controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 4px 12px",
                borderBottom: "1px solid #1e1e1e",
                marginBottom: "12px",
                color: "#888",
              }}
            >
              <Shuffle size={16} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ccc",
                }}
              >
                Random <ChevronDown size={14} />
              </div>
              <div style={{ flex: 1 }} />
              <Sparkles size={16} />
              <TrendingUp size={16} />
              <Star size={16} />
            </div>

            {/* Queue skeleton list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background: "#181818",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "7px" }}>
                    <div
                      style={{
                        height: "8px",
                        width: "70%",
                        borderRadius: "4px",
                        background: "#181818",
                      }}
                    />
                    <div
                      style={{
                        height: "8px",
                        width: "45%",
                        borderRadius: "4px",
                        background: "#141414",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
        {/* end center content */}

        {/* Right divider + brick */}
        {!isMobile && (
          <>
            <div
              style={{
                background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
                width: "2px",
              }}
            />
            <div
              style={{
                background: 'url("/black_gold_brick_texture.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "repeat",
                opacity: 0.55,
                transform: "scaleX(-1)",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
