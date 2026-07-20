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
  Play,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/supabaseClient";

const API_BASE =
  import.meta.env.VITE_TOOLS_API_URL || "https://threelixir-music.onrender.com";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#e8c76a";

// Free daily "digs" for signed-in, non-member users.
const DAILY_FREE_LIMIT = 25;
const FREE_TIERS = ["tier_zero", "black", ""];

// Genre tags to dig by (must match the backend's DIG_GENRES).
const GENRES = [
  "Electronic",
  "Hip Hop",
  "Funk / Soul",
  "Jazz",
  "Rock",
  "Reggae",
  "Latin",
  "Folk, World, & Country",
  "Pop",
  "Blues",
];

// Regions (Discogs country values) to dig by.
const COUNTRIES = [
  "US",
  "UK",
  "Germany",
  "France",
  "Japan",
  "Italy",
  "Canada",
  "Netherlands",
  "Sweden",
  "Brazil",
  "Jamaica",
  "Australia",
  "Spain",
  "Belgium",
];

const EMPTY_FILTERS = {
  genre: "",
  style: "",
  country: "",
  yearMin: "",
  yearMax: "",
  q: "",
};

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

interface DigTrack {
  artist: string;
  title: string;
  year: number | null;
  label: string | null;
  genre: string | null;
  style: string | null;
  country: string | null;
  youtubeId: string;
  videoTitle: string | null;
  thumb: string | null;
  musicalKey: string | null;
  bpm: number | null;
}

export default function SampleGenerator() {
  const { user, userProfile, openAuthModal } = useAuth();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [usedToday, setUsedToday] = useState(() =>
    user ? getUsedToday(user.id) : 0
  );
  const [current, setCurrent] = useState<DigTrack | null>(null);
  const [queue, setQueue] = useState<DigTrack[]>([]);
  const [digging, setDigging] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [digError, setDigError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const activeFilters = Object.values(filters).some((v) => v !== "");

  const tier = (
    userProfile?.subscription_tier ||
    user?.subscription_tier ||
    ""
  ).toLowerCase();
  const isMember = !!user && !FREE_TIERS.includes(tier);
  const remaining = Math.max(0, DAILY_FREE_LIMIT - usedToday);
  const limitReached = !!user && !isMember && remaining <= 0;

  const handleDig = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (limitReached) {
      setLocation("/vip");
      return;
    }
    setDigging(true);
    setDigError("");
    setPlaying(false);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        openAuthModal();
        return;
      }
      const res = await fetch(`${API_BASE}/api/dig`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(filters.genre ? { genre: filters.genre } : {}),
          ...(filters.style ? { style: filters.style } : {}),
          ...(filters.country ? { country: filters.country } : {}),
          ...(filters.yearMin ? { yearMin: filters.yearMin } : {}),
          ...(filters.yearMax ? { yearMax: filters.yearMax } : {}),
          ...(filters.q ? { q: filters.q } : {}),
        }),
      });

      if (res.status === 429) {
        setUsedToday(DAILY_FREE_LIMIT);
        setDigError("You've used your free digs for today.");
        return;
      }
      if (!res.ok) {
        const b = await res.json().catch(() => null);
        throw new Error(b?.error || "Dig failed — try again");
      }

      const data = await res.json();
      // Push the outgoing track into the queue, load the new one.
      setCurrent((prev) => {
        if (prev) setQueue((q) => [prev, ...q].slice(0, 12));
        return data.track as DigTrack;
      });

      if (!isMember) {
        if (typeof data.remaining === "number") {
          setUsedToday(DAILY_FREE_LIMIT - data.remaining);
        } else {
          incrementUsage(user.id);
          setUsedToday((n) => n + 1);
        }
      }
    } catch (e) {
      setDigError(e instanceof Error ? e.message : "Dig failed — try again");
    } finally {
      setDigging(false);
    }
  };

  const loadFromQueue = (t: DigTrack) => {
    setPlaying(false);
    setCurrent((prev) => {
      setQueue((q) => {
        const without = q.filter((x) => x !== t);
        return prev ? [prev, ...without].slice(0, 12) : without;
      });
      return t;
    });
  };

  const copyLink = () => {
    if (!current) return;
    navigator.clipboard
      ?.writeText(`https://youtu.be/${current.youtubeId}`)
      .catch(() => {});
  };

  const metaRows: [string, string, boolean?][] = current
    ? [
        ["Artist", current.artist],
        ["Release", current.title],
        ["Year", current.year ? String(current.year) : "—"],
        ["Genre", current.genre || "—"],
        ["Style", current.style || "—"],
        ["Region", current.country || "—"],
        ["Label", current.label || "—"],
        ["Key", current.musicalKey || "— (soon)"],
        ["Tempo", current.bpm ? `${current.bpm} BPM` : "— (soon)"],
      ]
    : [];

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

  const fieldLabel: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: GOLD,
    marginBottom: "8px",
  };
  const fieldInput: React.CSSProperties = {
    width: "100%",
    background: "#000",
    border: "1px solid #2a2620",
    borderRadius: "10px",
    padding: "11px 12px",
    fontSize: "14px",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
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
          gridTemplateColumns: isMobile ? "1fr" : "0.7fr 2px 2.6fr 2px 0.7fr",
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
                    : `Sign in · ${DAILY_FREE_LIMIT} free digs / day`}
                </span>
              </Link>
            )}
          </div>

          {/* Workspace */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Top: metadata + player */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "minmax(260px, 320px) 1fr",
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
                    color: current ? "#fff" : "#555",
                  }}
                >
                  {current ? current.title : "No record yet"}
                </div>

                {current ? (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                  >
                    {metaRows.map(([label, value]) => (
                      <div
                        key={label}
                        style={{ display: "flex", fontSize: "14px", gap: "12px" }}
                      >
                        <span
                          style={{ width: "84px", color: "#666", flexShrink: 0 }}
                        >
                          {label}
                        </span>
                        <span style={{ color: "#eee", fontWeight: 500 }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: "14px", color: "#666", lineHeight: 1.6 }}>
                    Hit <span style={{ color: GOLD }}>Dig</span> to pull up a random
                    record and its details.
                  </div>
                )}

                <div
                  style={{
                    marginTop: "22px",
                    paddingTop: "18px",
                    borderTop: "1px solid #1e1e1e",
                    fontSize: "12px",
                    color: "#555",
                  }}
                >
                  Data from <span style={{ color: "#4a9eff" }}>Discogs</span>
                </div>
              </div>

              {/* CENTER — Player + controls */}
              <div style={{ minWidth: 0 }}>
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
                        color: current ? "#fff" : "#666",
                      }}
                    >
                      {current
                        ? current.videoTitle || `${current.artist} — ${current.title}`
                        : "Nothing playing"}
                    </div>
                    <div style={{ fontSize: "13px", color: "#888" }}>
                      {current
                        ? [current.year, current.label]
                            .filter(Boolean)
                            .join(" · ") || "—"
                        : "Dig for a record to start"}
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
                  {current && playing ? (
                    <iframe
                      title="player"
                      src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&rel=0`}
                      style={{ width: "100%", height: "100%", border: "none" }}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      onClick={() => current && setPlaying(true)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: current ? "pointer" : "default",
                        background: current
                          ? `center / cover no-repeat url("https://img.youtube.com/vi/${current.youtubeId}/hqdefault.jpg")`
                          : "radial-gradient(circle at center, #1a1a1a 0%, #000 80%)",
                      }}
                    >
                      {current && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.35)",
                          }}
                        />
                      )}
                      <div
                        style={{
                          position: "relative",
                          width: "68px",
                          height: "48px",
                          borderRadius: "12px",
                          background: current ? "#f00" : "#2a2a2a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Play size={24} color="#fff" fill="#fff" />
                      </div>
                      {!current && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "16px",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          {digging ? "Digging…" : "Hit Dig to find a record"}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {digError && (
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "13px",
                      color: "#f87171",
                    }}
                  >
                    {digError}
                  </div>
                )}

                {/* Control bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "16px",
                  }}
                >
                  <div style={iconBtn} title="Search (soon)">
                    <Search size={18} />
                  </div>
                  <button
                    onClick={() => setFiltersOpen((v) => !v)}
                    title="Filter by genre"
                    style={{
                      ...iconBtn,
                      background:
                        activeFilters || filtersOpen ? `${GOLD}1f` : "#1a1a1a",
                      border: `1px solid ${
                        activeFilters || filtersOpen ? GOLD : "#262626"
                      }`,
                      color: activeFilters || filtersOpen ? GOLD : "#aaa",
                    }}
                  >
                    <SlidersHorizontal size={18} />
                  </button>
                  {/* Big shuffle / dig button */}
                  <button
                    onClick={handleDig}
                    disabled={digging}
                    style={{
                      flex: 1,
                      height: "44px",
                      border: "none",
                      borderRadius: "10px",
                      background: digging
                        ? "#3a3320"
                        : `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                      color: "#000",
                      cursor: digging ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      fontSize: "13px",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      boxShadow: digging ? "none" : `0 6px 20px ${GOLD}44`,
                    }}
                  >
                    <Shuffle size={18} />
                    {digging
                      ? "Digging…"
                      : !user
                        ? "Sign In to Dig"
                        : limitReached
                          ? "Upgrade for Unlimited"
                          : "Dig — Random Track"}
                  </button>
                  <div style={iconBtn} title="Timer (soon)">
                    <Timer size={18} />
                  </div>
                  <button
                    onClick={copyLink}
                    disabled={!current}
                    style={{
                      ...iconBtn,
                      opacity: current ? 1 : 0.4,
                      cursor: current ? "pointer" : "not-allowed",
                    }}
                    title="Copy YouTube link"
                  >
                    <Link2 size={18} />
                  </button>
                </div>

                {/* Filter panel */}
                {filtersOpen && (
                  <div style={{ ...card, marginTop: "12px", padding: "18px" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      {/* Genre */}
                      <div>
                        <label style={fieldLabel}>Genre</label>
                        <select
                          value={filters.genre}
                          onChange={(e) =>
                            setFilters((f) => ({ ...f, genre: e.target.value }))
                          }
                          style={{ ...fieldInput, cursor: "pointer" }}
                        >
                          <option value="">All</option>
                          {GENRES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Region */}
                      <div>
                        <label style={fieldLabel}>Region</label>
                        <select
                          value={filters.country}
                          onChange={(e) =>
                            setFilters((f) => ({ ...f, country: e.target.value }))
                          }
                          style={{ ...fieldInput, cursor: "pointer" }}
                        >
                          <option value="">Any</option>
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Style */}
                      <div>
                        <label style={fieldLabel}>Style</label>
                        <input
                          value={filters.style}
                          onChange={(e) =>
                            setFilters((f) => ({ ...f, style: e.target.value }))
                          }
                          placeholder="e.g. Acid, Boom Bap, Disco"
                          style={fieldInput}
                        />
                      </div>

                      {/* Search / tags */}
                      <div>
                        <label style={fieldLabel}>Search / Tags</label>
                        <input
                          value={filters.q}
                          onChange={(e) =>
                            setFilters((f) => ({ ...f, q: e.target.value }))
                          }
                          placeholder="artist, label, any keyword"
                          style={fieldInput}
                        />
                      </div>

                      {/* Year range (full width) */}
                      <div style={{ gridColumn: isMobile ? "auto" : "1 / -1" }}>
                        <label style={fieldLabel}>Year</label>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            type="number"
                            value={filters.yearMin}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, yearMin: e.target.value }))
                            }
                            placeholder="Min"
                            style={fieldInput}
                          />
                          <input
                            type="number"
                            value={filters.yearMax}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, yearMax: e.target.value }))
                            }
                            placeholder="Max"
                            style={fieldInput}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        marginTop: "18px",
                      }}
                    >
                      <button
                        onClick={() => setFilters({ ...EMPTY_FILTERS })}
                        style={{
                          background: "transparent",
                          border: "1px solid #2a2a2a",
                          borderRadius: "100px",
                          padding: "9px 20px",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#aaa",
                          cursor: "pointer",
                        }}
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => {
                          setFiltersOpen(false);
                          handleDig();
                        }}
                        style={{
                          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                          border: "none",
                          borderRadius: "100px",
                          padding: "9px 24px",
                          fontSize: "12px",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#000",
                          cursor: "pointer",
                        }}
                      >
                        Apply & Dig
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* end top: metadata + player */}

            {/* BOTTOM — Queue (full width) */}
            <div style={{ ...card, padding: "18px" }}>
              {/* Header: label + controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  paddingBottom: "14px",
                  marginBottom: "16px",
                  borderBottom: "1px solid #1e1e1e",
                  color: "#888",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: GOLD,
                  }}
                >
                  Up Next
                </span>
                <Shuffle
                  size={16}
                  style={{ cursor: "pointer" }}
                  onClick={handleDig}
                />
                <div
                  onClick={() => setFiltersOpen((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: activeFilters ? GOLD : "#ccc",
                    cursor: "pointer",
                  }}
                >
                  {filters.genre || (activeFilters ? "Filtered" : "Random")}{" "}
                  <ChevronDown size={14} />
                </div>
                <div style={{ flex: 1 }} />
                <Sparkles size={16} />
                <TrendingUp size={16} />
                <Star size={16} />
              </div>

              {/* Horizontal track row */}
              {current || queue.length ? (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    overflowX: "auto",
                    paddingBottom: "4px",
                  }}
                >
                  {/* Now playing (highlighted) */}
                  {current && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        minWidth: "230px",
                        padding: "10px",
                        borderRadius: "12px",
                        background: "#181818",
                        border: `1px solid ${GOLD}44`,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          background: `center / cover no-repeat url("https://img.youtube.com/vi/${current.youtubeId}/default.jpg")`,
                          flexShrink: 0,
                        }}
                      />
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
                          {current.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#888" }}>
                          {current.artist}
                          {current.year ? ` · ${current.year}` : ""}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Queue items (clickable) */}
                  {queue.map((t, i) => (
                    <div
                      key={i}
                      onClick={() => loadFromQueue(t)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        minWidth: "200px",
                        padding: "10px",
                        borderRadius: "12px",
                        background: "#141414",
                        border: "1px solid #1e1e1e",
                        flexShrink: 0,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          background: `center / cover no-repeat url("https://img.youtube.com/vi/${t.youtubeId}/default.jpg")`,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#ddd",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {t.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {t.artist}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: "13px", color: "#555", padding: "8px 2px" }}>
                  Records you dig will stack up here.
                </div>
              )}
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
