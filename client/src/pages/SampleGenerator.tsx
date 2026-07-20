// client/src/pages/SampleGenerator.tsx
import { useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const SAMPLE_TYPES = [
  { value: "loops", label: "Loops" },
  { value: "oneshots", label: "One-Shots" },
  { value: "chops", label: "Chops" },
  { value: "all", label: "Everything" },
];

const SLICE_COUNTS = [8, 16, 32];

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#e8c76a";

// Static decorative waveform shape (bar heights in %). Stands in for the real
// waveform until the backend returns actual audio peak data.
const WAVE = Array.from({ length: 60 }, (_, i) =>
  22 + Math.abs(Math.sin(i * 0.45) * Math.cos(i * 0.19) + Math.sin(i * 0.11)) * 74
);

// Free daily generations for signed-in, non-member users.
const DAILY_FREE_LIMIT = 10;
// Non-member tiers (everything else = paid member with unlimited usage).
const FREE_TIERS = ["tier_zero", "black", ""];

// NOTE: This client-side counter is a UX layer only. The real quota MUST be
// enforced server-side once the backend is built — the server returns the
// authoritative "remaining" count. localStorage is trivially bypassable.
function usageKey(userId: string) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
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

export default function SampleGenerator() {
  const { user, userProfile, openAuthModal } = useAuth();
  const [, setLocation] = useLocation();
  const [url, setUrl] = useState("");
  const [sampleType, setSampleType] = useState("loops");
  const [slices, setSlices] = useState(16);
  const [activePad, setActivePad] = useState<number | null>(null);
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

  // Prefer userProfile.subscription_tier — reliably populated.
  const tier = (
    userProfile?.subscription_tier ||
    user?.subscription_tier ||
    ""
  ).toLowerCase();
  const isMember = !!user && !FREE_TIERS.includes(tier);
  const remaining = Math.max(0, DAILY_FREE_LIMIT - usedToday);
  const limitReached = !!user && !isMember && remaining <= 0;
  const hasSource = !!url.trim() || !!file;

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

  const handleGenerate = async () => {
    // Must be signed in to use the generator.
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
      setError("Paste a URL or drop a file to sample.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let response: Response;
      if (file) {
        const form = new FormData();
        form.append("file", file);
        form.append("sampleType", sampleType);
        form.append("slices", String(slices));
        response = await fetch("/api/generate-samples", {
          method: "POST",
          body: form,
        });
      } else {
        response = await fetch("/api/generate-samples", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim(), sampleType, slices }),
        });
      }

      if (!response.ok) throw new Error("Sample generation failed");

      const data = await response.json();
      setSuccess(`Samples ready! Download link: ${data.downloadUrl}`);
      setUrl("");
      setFile(null);

      if (!isMember) {
        incrementUsage(user.id);
        setUsedToday((n) => n + 1);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during sample generation"
      );
    } finally {
      setLoading(false);
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

        {/* Center Panel - Generator UI */}
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
                Sample Generator
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
                Any Track.
                <br />
                <span
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Endless Samples.
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
                Paste a YouTube link or drop a track and chop it into loop-ready
                samples and one-shots for your next beat.
              </p>
            </div>

            {/* Generator Card */}
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
                Source URL
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

              {/* Waveform + slice grid */}
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
                Waveform
              </label>
              <div
                style={{
                  position: "relative",
                  height: "96px",
                  background: "#000",
                  border: "1px solid #2a2620",
                  borderRadius: "12px",
                  padding: "0 12px",
                  marginBottom: "22px",
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  overflow: "hidden",
                }}
              >
                {WAVE.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      background: hasSource
                        ? `linear-gradient(to top, ${GOLD}, ${GOLD_LIGHT})`
                        : "#222",
                      borderRadius: "2px",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
                {/* Slice divider lines */}
                {Array.from({ length: slices - 1 }).map((_, i) => (
                  <div
                    key={`slice-${i}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: `${((i + 1) / slices) * 100}%`,
                      width: "1px",
                      background: hasSource ? `${GOLD}66` : "#1a1a1a",
                    }}
                  />
                ))}
                {!hasSource && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      fontSize: "12px",
                      color: "#555",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Load a source to slice
                  </span>
                )}
              </div>

              {/* Controls: Slices + Sample Type */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "22px",
                }}
              >
                <div>
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
                    Slices
                  </label>
                  <select
                    value={slices}
                    onChange={(e) => setSlices(parseInt(e.target.value, 10))}
                    style={{
                      width: "100%",
                      background: "#000",
                      border: "1px solid #2a2620",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      fontSize: "15px",
                      color: "#fff",
                      outline: "none",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                  >
                    {SLICE_COUNTS.map((c) => (
                      <option key={c} value={c}>
                        {c} slices
                      </option>
                    ))}
                  </select>
                </div>
                <div>
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
                    Type
                  </label>
                  <select
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#000",
                      border: "1px solid #2a2620",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      fontSize: "15px",
                      color: "#fff",
                      outline: "none",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                  >
                    {SAMPLE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pad grid */}
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
                Pads
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  marginBottom: "28px",
                }}
              >
                {Array.from({ length: 16 }).map((_, i) => {
                  const isActive = activePad === i;
                  const lit = hasSource;
                  return (
                    <div
                      key={i}
                      onMouseDown={() => setActivePad(i)}
                      onMouseUp={() => setActivePad(null)}
                      onMouseLeave={() => activePad === i && setActivePad(null)}
                      style={{
                        aspectRatio: "1",
                        borderRadius: "10px",
                        border: `1px solid ${lit ? GOLD + "55" : "#1e1c18"}`,
                        background: isActive
                          ? `linear-gradient(160deg, ${GOLD}, ${GOLD_LIGHT})`
                          : lit
                            ? `linear-gradient(160deg, ${GOLD}22, ${GOLD}0a)`
                            : "#0d0c0a",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        padding: "6px",
                        cursor: lit ? "pointer" : "default",
                        transition: "background 0.1s, transform 0.1s",
                        transform: isActive ? "scale(0.95)" : "scale(1)",
                        boxShadow: isActive ? `0 0 16px ${GOLD}55` : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: isActive ? "#000" : lit ? GOLD_LIGHT : "#333",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  );
                })}
              </div>

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
                      Out of free generations for today
                    </div>
                    <div style={{ fontSize: "12px", color: "#999", lineHeight: 1.5 }}>
                      Go unlimited with a membership → tap to view plans.
                    </div>
                  </div>
                </Link>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
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
                  ? "Generating..."
                  : !user
                    ? "Sign In to Generate"
                    : limitReached
                      ? "Upgrade for Unlimited"
                      : "Generate Samples"}
              </button>

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
                Sampling runs on our server. Only sample content you own or have
                the rights to use.
              </p>
            </div>
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
