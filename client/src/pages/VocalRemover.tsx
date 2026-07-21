// client/src/pages/VocalRemover.tsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";

// Base URL of the tools backend (Render). Override with VITE_TOOLS_API_URL.
const API_BASE =
  import.meta.env.VITE_TOOLS_API_URL || "https://threelixir-music.onrender.com";

const OUTPUT_FORMATS = [
  { value: "mp3", label: "MP3 · Audio" },
  { value: "wav", label: "WAV · Audio" },
  { value: "m4a", label: "M4A · Audio" },
];

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#e8c76a";

// Free daily conversions for signed-in, non-member users.
const DAILY_FREE_LIMIT = 10;
// Non-member tiers (everything else = paid member with unlimited usage).
// Matches the convention used across the VIP pages.
const FREE_TIERS = ["tier_zero", "black", ""];

// NOTE: This client-side counter is a UX layer only. The real quota MUST be
// enforced server-side in /api/convert once the backend is built — the server
// returns the authoritative "remaining" count. localStorage is trivially
// bypassable and exists here purely to drive the UI before that lands.
function usageKey(userId: string) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `vr_usage_${userId}_${today}`;
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

// --- Recent downloads history (per user, in the browser) -------------------
interface HistoryItem {
  filename: string;
  url: string; // relative, e.g. /api/download/<id>
  format: string;
  ts: number;
}

function historyKey(userId: string) {
  return `vr_history_${userId}`;
}

function loadHistory(userId?: string): HistoryItem[] {
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(historyKey(userId)) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(userId: string, items: HistoryItem[]) {
  try {
    localStorage.setItem(historyKey(userId), JSON.stringify(items.slice(0, 20)));
  } catch {
    /* ignore */
  }
}

// Reliable download trigger (an <a> click isn't blocked like window.open).
function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export default function VocalRemover() {
  const { user, userProfile, openAuthModal } = useAuth();
  const [, setLocation] = useLocation();
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [urlFocused, setUrlFocused] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [usedToday, setUsedToday] = useState(() =>
    user ? getUsedToday(user.id) : 0
  );
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() =>
    loadHistory(user?.id)
  );
  const [mode, setMode] = useState<"instrumental" | "vocals" | "both">("both");
  const [results, setResults] = useState<
    { kind: string; filename: string; downloadUrl: string }[]
  >([]);

  // Load this user's history once their session resolves.
  useEffect(() => {
    if (user?.id) setHistory(loadHistory(user.id));
  }, [user?.id]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith("video/") && !f.type.startsWith("audio/")) {
      setError("Please drop a video or audio file.");
      return;
    }
    setError("");
    setUrl(""); // file and URL are mutually exclusive
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  // Prefer userProfile.subscription_tier — it's reliably populated, unlike the
  // tier merged onto the user object (which can be stale in AuthContext).
  const tier = (
    userProfile?.subscription_tier ||
    user?.subscription_tier ||
    ""
  ).toLowerCase();
  const isMember = !!user && !FREE_TIERS.includes(tier);
  const remaining = Math.max(0, DAILY_FREE_LIMIT - usedToday);
  const limitReached = !!user && !isMember && remaining <= 0;

  const handleConvert = async () => {
    // Must be signed in to use the converter.
    if (!user) {
      openAuthModal();
      return;
    }

    // Free tier exhausted for the day — send them to membership plans.
    if (limitReached) {
      setLocation("/vip");
      return;
    }

    if (!url.trim() && !file) {
      setError("Paste a URL or drop a file to convert.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setResults([]);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    try {
      // Attach the user's Supabase access token so the backend can enforce quota.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        openAuthModal();
        return;
      }
      const authHeader = { Authorization: `Bearer ${token}` };

      let response: Response;
      if (file) {
        // Upload a local file as multipart form data.
        const form = new FormData();
        form.append("file", file);
        form.append("format", format);
        form.append("mode", mode);
        response = await fetch(`${API_BASE}/api/remove-vocals`, {
          method: "POST",
          headers: authHeader,
          body: form,
        });
      } else {
        // Process from a remote URL.
        response = await fetch(`${API_BASE}/api/remove-vocals`, {
          method: "POST",
          headers: { ...authHeader, "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim(), format, mode }),
        });
      }

      // Server-enforced daily limit.
      if (response.status === 429) {
        setUsedToday(DAILY_FREE_LIMIT); // flips UI to "limit reached"
        setError("You've used your free removals for today.");
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Vocal removal failed");
      }

      const data = await response.json();
      const outs = (data.outputs || []) as {
        kind: string;
        filename: string;
        downloadUrl: string;
      }[];
      setResults(outs);
      setSuccess(outs.length ? "Done — preview and download your stems below." : "");
      setUrl("");
      setFile(null);

      // Record each stem in the recent-downloads history.
      const items: HistoryItem[] = outs.map((o) => ({
        filename: o.filename,
        url: o.downloadUrl,
        format,
        ts: Date.now(),
      }));
      const next = [...items, ...history].slice(0, 20);
      setHistory(next);
      saveHistory(user.id, next);

      // Sync the local counter with the server's authoritative remaining count.
      if (!isMember) {
        if (typeof data.remaining === "number") {
          setUsedToday(DAILY_FREE_LIMIT - data.remaining);
        } else {
          incrementUsage(user.id);
          setUsedToday((n) => n + 1);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during conversion"
      );
    } finally {
      setLoading(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
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

      {/* 3-Panel Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2px 2fr 2px 1fr",
          minHeight: "calc(100vh - 80px)",
          position: "relative",
        }}
      >
        {/* Left Panel - Brick Texture */}
        <div
          style={{
            background: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            opacity: 0.55,
            position: "relative",
          }}
        />

        {/* Left Divider */}
        <div
          style={{
            background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
            width: "2px",
          }}
        />

        {/* Center Panel - Converter UI */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "48px 56px",
            overflow: "hidden",
          }}
        >
          {/* Gold ambient glow behind card */}
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "600px",
              background: `radial-gradient(circle, ${GOLD}18 0%, transparent 65%)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Back link */}
          <Link href="/tools">
            <span
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#555",
                cursor: "pointer",
                transition: "color 0.2s",
                alignSelf: "flex-start",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = GOLD)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#555")
              }
            >
              ← Back to Tools
            </span>
          </Link>

          {/* Content wrapper - fills and centers */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: "620px",
              width: "100%",
              margin: "0 auto",
              paddingTop: "24px",
              paddingBottom: "24px",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "40px" }}>
              <div
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: GOLD,
                  border: `1px solid ${GOLD}44`,
                  background: `${GOLD}0a`,
                  borderRadius: "100px",
                  padding: "6px 18px",
                  marginBottom: "24px",
                }}
              >
                Vocal Remover
              </div>
              <h1
                style={{
                  fontSize: "clamp(44px, 5vw, 64px)",
                  fontWeight: 800,
                  lineHeight: 0.98,
                  letterSpacing: "-0.03em",
                  margin: "0 0 18px",
                }}
              >
                Kill the Vocals.
                <br />
                <span
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Keep the Beat.
                </span>
              </h1>
              <p
                style={{
                  fontSize: "16px",
                  color: "#888",
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: "480px",
                }}
              >
                Paste a YouTube link or drop a track and pull the vocals out —
                get a clean instrumental in seconds. Works best on songs with
                center-panned vocals.
              </p>
            </div>

            {/* Converter Card */}
            <div
              style={{
                width: "100%",
                background:
                  "linear-gradient(160deg, #121110 0%, #0a0a0a 100%)",
                border: `1px solid ${GOLD}33`,
                borderRadius: "20px",
                padding: "36px",
                boxShadow: `0 0 60px ${GOLD}12, inset 0 1px 0 ${GOLD}18`,
              }}
            >
              {/* Usage status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "12px 16px",
                  marginBottom: "24px",
                  background: "#000",
                  border: `1px solid ${isMember ? GOLD + "55" : "#2a2620"}`,
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: isMember ? GOLD_LIGHT : "#aaa",
                  }}
                >
                  {!user
                    ? "Sign in to use — 10 free / day"
                    : isMember
                      ? "★ Member · Unlimited"
                      : `${remaining} of ${DAILY_FREE_LIMIT} free left today`}
                </span>
                {user && !isMember && (
                  <Link href="/vip">
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: GOLD,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Go Unlimited →
                    </span>
                  </Link>
                )}
              </div>

              {/* URL Input */}
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: GOLD,
                  marginBottom: "10px",
                }}
              >
                Video URL
              </label>
              <input
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (file) setFile(null);
                }}
                onFocus={() => setUrlFocused(true)}
                onBlur={() => setUrlFocused(false)}
                style={{
                  width: "100%",
                  background: "#000",
                  border: `1px solid ${urlFocused ? GOLD : "#2a2620"}`,
                  borderRadius: "12px",
                  padding: "16px 18px",
                  fontSize: "15px",
                  color: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: "20px",
                  transition: "border-color 0.2s",
                }}
              />

              {/* OR divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ flex: 1, height: "1px", background: "#2a2620" }} />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "#555",
                  }}
                >
                  OR
                </span>
                <div style={{ flex: 1, height: "1px", background: "#2a2620" }} />
              </div>

              {/* Drag & Drop Zone */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,audio/*"
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragActive ? GOLD : file ? GOLD + "88" : "#2a2620"}`,
                  background: dragActive ? `${GOLD}0f` : "#000",
                  borderRadius: "12px",
                  padding: "28px 18px",
                  marginBottom: "28px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                {file ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: GOLD_LIGHT,
                        wordBreak: "break-all",
                      }}
                    >
                      {file.name}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      style={{
                        fontSize: "16px",
                        color: "#888",
                        cursor: "pointer",
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </span>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#aaa",
                        marginBottom: "4px",
                      }}
                    >
                      Drag & drop a file here
                    </div>
                    <div style={{ fontSize: "12px", color: "#555" }}>
                      or click to browse · video &amp; audio files
                    </div>
                  </>
                )}
              </div>

              {/* What to extract */}
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: GOLD,
                  marginBottom: "10px",
                }}
              >
                What do you want?
              </label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {(
                  [
                    ["instrumental", "Instrumental"],
                    ["vocals", "Vocals"],
                    ["both", "Both"],
                  ] as const
                ).map(([val, label]) => {
                  const active = mode === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setMode(val)}
                      style={{
                        flex: 1,
                        padding: "13px 8px",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        color: active ? "#000" : "#ccc",
                        background: active
                          ? `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`
                          : "#000",
                        border: `1px solid ${active ? GOLD : "#2a2620"}`,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Format */}
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: GOLD,
                  marginBottom: "10px",
                }}
              >
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                style={{
                  width: "100%",
                  background: "#000",
                  border: "1px solid #2a2620",
                  borderRadius: "12px",
                  padding: "16px 18px",
                  fontSize: "15px",
                  color: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: "28px",
                  cursor: "pointer",
                }}
              >
                {OUTPUT_FORMATS.map((fmt) => (
                  <option key={fmt.value} value={fmt.value}>
                    {fmt.label}
                  </option>
                ))}
              </select>

              {error && (
                <div
                  style={{
                    background: "rgba(220,38,38,0.1)",
                    border: "1px solid rgba(220,38,38,0.3)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "13px",
                    color: "#f87171",
                    marginBottom: "20px",
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  style={{
                    background: `${GOLD}14`,
                    border: `1px solid ${GOLD}44`,
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "13px",
                    color: GOLD_LIGHT,
                    marginBottom: "20px",
                    wordBreak: "break-all",
                  }}
                >
                  ✓ {success}
                </div>
              )}

              {/* Upgrade banner when free limit is reached */}
              {limitReached && (
                <Link href="/vip">
                  <div
                    style={{
                      background: `linear-gradient(160deg, ${GOLD}1c, ${GOLD}0a)`,
                      border: `1px solid ${GOLD}55`,
                      borderRadius: "12px",
                      padding: "16px 18px",
                      marginBottom: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 800,
                        color: GOLD_LIGHT,
                        marginBottom: "4px",
                      }}
                    >
                      Out of free conversions for today
                    </div>
                    <div style={{ fontSize: "12px", color: "#999", lineHeight: 1.5 }}>
                      Go unlimited with a membership → tap to view plans.
                    </div>
                  </div>
                </Link>
              )}

              {/* Convert Button */}
              <button
                onClick={handleConvert}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "17px",
                  background: loading
                    ? "#3a3320"
                    : `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                  color: "#000",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  border: "none",
                  borderRadius: "100px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "transform 0.15s ease, box-shadow 0.2s ease",
                  boxShadow: loading ? "none" : `0 8px 24px ${GOLD}33`,
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                {loading
                  ? `Processing… ${elapsed}s`
                  : !user
                    ? "Sign In to Remove"
                    : limitReached
                      ? "Upgrade for Unlimited"
                      : "Remove Vocals"}
              </button>

              {loading && (
                <p
                  style={{
                    fontSize: "12px",
                    color: GOLD,
                    textAlign: "center",
                    marginTop: "14px",
                    marginBottom: 0,
                  }}
                >
                  Working on it — longer videos take more time ({elapsed}s)
                </p>
              )}

              {/* Results — preview + download each stem */}
              {results.length > 0 && (
                <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {results.map((r) => {
                    const isVocals = r.kind === "vocals";
                    return (
                      <div
                        key={r.filename}
                        style={{
                          background: "#0a0a0a",
                          border: `1px solid ${GOLD}33`,
                          borderRadius: "14px",
                          padding: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "12px",
                            marginBottom: "12px",
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 800,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: GOLD,
                              }}
                            >
                              {isVocals ? "Vocals" : "Instrumental"}
                              {isVocals && (
                                <span
                                  style={{
                                    marginLeft: "8px",
                                    fontSize: "10px",
                                    color: "#777",
                                    fontWeight: 600,
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  rough
                                </span>
                              )}
                            </div>
                          </div>
                          <a
                            href={`${API_BASE}${r.downloadUrl}`}
                            download={r.filename}
                            style={{
                              flexShrink: 0,
                              fontSize: "11px",
                              fontWeight: 800,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#000",
                              background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                              borderRadius: "100px",
                              padding: "9px 18px",
                              textDecoration: "none",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Download
                          </a>
                        </div>
                        <audio
                          controls
                          preload="none"
                          src={`${API_BASE}${r.downloadUrl}?inline=1`}
                          style={{ width: "100%", height: "40px" }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Info note */}
              <p
                style={{
                  fontSize: "12px",
                  color: "#555",
                  lineHeight: 1.6,
                  marginTop: "20px",
                  marginBottom: 0,
                  textAlign: "center",
                }}
              >
                Downloads run on our server. Only download content you own or
                have the rights to use.
              </p>
            </div>

            {/* Recent downloads */}
            {history.length > 0 && (
              <div style={{ marginTop: "28px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "14px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: GOLD,
                    }}
                  >
                    Recent Downloads
                  </span>
                  <span
                    onClick={() => {
                      setHistory([]);
                      if (user) saveHistory(user.id, []);
                    }}
                    style={{ fontSize: "11px", color: "#555", cursor: "pointer" }}
                  >
                    Clear
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {history.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        background: "#0a0a0a",
                        border: "1px solid #1a1a1a",
                        borderRadius: "12px",
                        padding: "12px 14px",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#eee",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {h.filename}
                        </div>
                        <div style={{ fontSize: "11px", color: "#555" }}>
                          {h.format.toUpperCase()} · {timeAgo(h.ts)}
                        </div>
                      </div>
                      <a
                        href={`${API_BASE}${h.url}`}
                        download={h.filename}
                        style={{
                          flexShrink: 0,
                          fontSize: "11px",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: GOLD,
                          border: `1px solid ${GOLD}55`,
                          borderRadius: "100px",
                          padding: "7px 14px",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>

                <p
                  style={{
                    fontSize: "11px",
                    color: "#444",
                    marginTop: "12px",
                    marginBottom: 0,
                    textAlign: "center",
                  }}
                >
                  Files are kept for a few hours — older links may have expired.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Divider */}
        <div
          style={{
            background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
            width: "2px",
          }}
        />

        {/* Right Panel - Brick Texture */}
        <div
          style={{
            background: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            opacity: 0.55,
            position: "relative",
            transform: "scaleX(-1)",
          }}
        />
      </div>
    </div>
  );
}
