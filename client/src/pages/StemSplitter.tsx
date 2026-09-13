// client/src/pages/StemSplitter.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useSEO, toolSchema } from "@/hooks/useSEO";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { analytics } from "@/utils/analytics";
import {
  detectStemCapability,
  needsModelDownload,
  separateStems,
  clearModelCache,
  releaseStemEngine,
  QUALITY_PRESETS,
  type QualityPreset,
  type StemCapability,
  type StemFile,
} from "@/lib/stems";

// Quota counter lives on the tools backend (Render). Separation itself never
// touches it -- see /api/quota/stems.
const API_BASE =
  import.meta.env.VITE_TOOLS_API_URL || "https://threelixir-music.onrender.com";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#e8c76a";

const MODEL_SIZE_LABEL = "~172MB";

function formatMb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(0)}MB`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m ? `${m}m ${s}s` : `${s}s`;
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function StemSplitter() {
  useSEO({
    title: "Free AI Stem Splitter — Separate Vocals, Drums & Bass | 3LIXIR",
    description:
      "Split any song into four studio-quality stems — vocals, drums, bass and instruments — with real AI. Runs entirely in your browser, so your audio never leaves your computer. Free, no upload.",
    canonical: "/tools/stem-splitter",
    jsonLd: toolSchema(
      "3LIXIR Stem Splitter",
      "Free AI stem splitter that separates vocals, drums, bass and other instruments locally in your browser.",
      "/tools/stem-splitter",
    ),
  });

  const { user, openAuthModal } = useAuth();

  const [capability, setCapability] = useState<StemCapability | null>(null);
  const [modelCached, setModelCached] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<QualityPreset>("fast");
  const [dragActive, setDragActive] = useState(false);
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState("");
  const [downloadPct, setDownloadPct] = useState<number | null>(null);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [separatePct, setSeparatePct] = useState(0);
  const [error, setError] = useState("");
  const [stems, setStems] = useState<StemFile[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [lastRun, setLastRun] = useState<{ seconds: number; backend: string } | null>(
    null,
  );
  const [remaining, setRemaining] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Object URLs outlive React state, so track them for explicit revocation.
  const stemUrlsRef = useRef<string[]>([]);

  // --- Capability + cache probe -------------------------------------------
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const cap = await detectStemCapability();
      if (cancelled) return;
      setCapability(cap);
      if (cap.backend) setModelCached(!(await needsModelDownload()));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // On leaving the tool: revoke every object URL we handed out, and shut the
  // engine down so the model and its GPU memory don't follow the user around
  // the rest of the site.
  useEffect(
    () => () => {
      stemUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      if (timerRef.current) clearInterval(timerRef.current);
      releaseStemEngine();
    },
    [],
  );

  // Warn before a reload or tab close takes a run down with it.
  //
  // Separation state lives only in this page's worker: there is no server-side
  // job to reconnect to, so a reload doesn't interrupt the work, it destroys
  // it. Browsers ignore custom text here and show their own wording, and the
  // prompt only appears if the user has interacted with the page -- which,
  // having clicked Split, they have.
  useEffect(() => {
    if (!running) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Legacy property some browsers still require to trigger the dialog.
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [running]);

  // --- Quota counter (display only) ---------------------------------------
  const refreshQuota = useCallback(async () => {
    if (!user) return;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/quota/stems`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const body = await res.json();
      setRemaining(body.isMember ? null : body.remaining ?? null);
    } catch {
      // Counter is cosmetic -- never block the tool on it.
    }
  }, [user]);

  useEffect(() => {
    void refreshQuota();
  }, [refreshQuota]);

  /**
   * Record a completed separation. Deliberately fire-and-forget: the work
   * already happened on this machine and cost us nothing, so a failed or
   * blocked counter write must not surface as an error.
   */
  const recordUsage = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/quota/stems`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const body = await res.json();
      setRemaining(body.isMember ? null : body.remaining ?? null);
    } catch {
      /* ignore */
    }
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const f = files[0];
    if (!f.type.startsWith("audio/") && !f.type.startsWith("video/")) {
      setError("Please drop an audio file (MP3, WAV, M4A, FLAC or OGG).");
      return;
    }
    setError("");
    setUrl(""); // file and URL are mutually exclusive
    setFile(f);
  };

  /**
   * Pull audio for a URL through the existing converter endpoint.
   *
   * yt-dlp only exists on the tools backend, so the download has to happen
   * there -- but it hands back a plain WAV, and the separation itself still
   * runs here on this machine. Note this spends one of the user's *converter*
   * credits, since it is literally a conversion.
   */
  const fetchUrlAudio = async (sourceUrl: string): Promise<ArrayBuffer> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error("Sign in required");

    const res = await fetch(`${API_BASE}/api/convert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: sourceUrl, format: "wav" }),
    });
    if (res.status === 429) {
      throw new Error("You've used your free downloads for today.");
    }
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error || "Couldn't fetch audio from that link.");
    }
    const { downloadUrl } = await res.json();
    const audio = await fetch(`${API_BASE}${downloadUrl}`);
    if (!audio.ok) throw new Error("Couldn't retrieve the downloaded audio.");
    return await audio.arrayBuffer();
  };

  const reset = () => {
    stemUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    stemUrlsRef.current = [];
    setStems([]);
    setError("");
    setSeparatePct(0);
    setDownloadPct(null);
    setDownloadedBytes(0);
    setStage("");
  };

  const handleSplit = async () => {
    if (!user) {
      analytics.toolSignupRequired("stem_splitter");
      openAuthModal();
      return;
    }
    if ((!file && !url.trim()) || !capability?.backend) return;

    reset();
    setRunning(true);
    setElapsed(0);
    analytics.toolStart("stem_splitter", file ? "file" : "url");
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    try {
      let bytes: ArrayBuffer;
      if (file) {
        bytes = await file.arrayBuffer();
      } else {
        setStage("Fetching audio");
        bytes = await fetchUrlAudio(url.trim());
      }
      const result = await separateStems(
        bytes,
        capability,
        {
          onStage: setStage,
          onModelProgress: (p) => {
            setDownloadedBytes(p.receivedBytes);
            setDownloadPct(p.progress);
          },
          onProgress: setSeparatePct,
        },
        quality,
      );

      stemUrlsRef.current.push(...result.stems.map((s) => s.url));
      setStems(result.stems);
      setLastRun({ seconds: result.durationSeconds, backend: result.backend });
      setModelCached(true);
      analytics.toolComplete("stem_splitter", {
        backend: result.backend,
        resultCount: result.stems.length,
        durationSeconds: Math.round(result.durationSeconds),
      });
      void recordUsage();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Separation failed. Please try again.",
      );
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setRunning(false);
      setStage("");
    }
  };

  const baseName = file?.name.replace(/\.[^.]+$/, "") || "track";
  const hasSource = !!file || !!url.trim();
  const unsupported = capability && !capability.backend;

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: "0 24px" }}>
        <div
          style={{
            maxWidth: "620px",
            width: "100%",
            margin: "0 auto",
            paddingTop: "24px",
            paddingBottom: "64px",
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
              Stem Splitter
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
              Four Stems.
              <br />
              <span
                style={{
                  background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Zero Uploads.
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
              Real AI separation — vocals, drums, bass and everything else — running
              entirely on your own machine. Your audio is never uploaded anywhere.
            </p>
          </div>

          {/* Unsupported device: send them to the lightweight tool instead. */}
          {unsupported && (
            <div
              style={{
                border: "1px solid #3a2a1a",
                background: "#150f08",
                borderRadius: "14px",
                padding: "22px",
                marginBottom: "24px",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "8px" }}>
                Not available on this device
              </div>
              <p style={{ color: "#999", fontSize: "14px", lineHeight: 1.6, margin: "0 0 14px" }}>
                {capability?.reason}
              </p>
              <Link
                href="/tools/vocal-remover"
                style={{ color: GOLD, fontWeight: 600, fontSize: "14px" }}
              >
                Use the Vocal Remover instead →
              </Link>
            </div>
          )}

          {!unsupported && (
            <div
              style={{
                width: "100%",
                background: "linear-gradient(160deg, #121110 0%, #0a0a0a 100%)",
                border: "1px solid #1f1d1a",
                borderRadius: "18px",
                padding: "28px",
              }}
            >
              {/* Source: a link, or a local file. */}
              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (e.target.value) setFile(null);
                }}
                disabled={running}
                placeholder="Paste a YouTube or SoundCloud link"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "1px solid #2a2724",
                  background: "#0e0d0c",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  marginBottom: "14px",
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  margin: "0 0 14px",
                  color: "#555",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                }}
              >
                <span style={{ flex: 1, height: "1px", background: "#1a1816" }} />
                OR
                <span style={{ flex: 1, height: "1px", background: "#1a1816" }} />
              </div>

              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => !running && fileInputRef.current?.click()}
                style={{
                  border: `1.5px dashed ${dragActive ? GOLD : "#2a2724"}`,
                  background: dragActive ? `${GOLD}0a` : "transparent",
                  borderRadius: "14px",
                  padding: "32px 20px",
                  textAlign: "center",
                  cursor: running ? "default" : "pointer",
                  transition: "all .15s ease",
                }}
              >
                <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
                  {file ? file.name : "Drop a track, or click to browse"}
                </div>
                <div style={{ fontSize: "13px", color: "#777" }}>
                  {file
                    ? `${formatMb(file.size)} · ready to split`
                    : "MP3, WAV, M4A, FLAC or OGG"}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*"
                  hidden
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {/* First-run download warning */}
              {modelCached === false && !running && (
                <div
                  style={{
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#9a8a66",
                    lineHeight: 1.6,
                  }}
                >
                  First run downloads the {MODEL_SIZE_LABEL} AI model. It's cached
                  afterwards, so this only happens once.
                </div>
              )}

              {capability?.reason && capability.backend && (
                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "13px",
                    color: "#9a8a66",
                    lineHeight: 1.6,
                  }}
                >
                  {capability.reason}
                </div>
              )}

              {/* Quality: trades time for separation quality. */}
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  Quality
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {(
                    Object.keys(QUALITY_PRESETS) as QualityPreset[]
                  ).map((key) => {
                    const active = quality === key;
                    const preset = QUALITY_PRESETS[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setQuality(key)}
                        disabled={running}
                        style={{
                          flex: 1,
                          padding: "10px 8px",
                          borderRadius: "10px",
                          cursor: running ? "default" : "pointer",
                          border: `1px solid ${active ? GOLD : "#2a2724"}`,
                          background: active ? `${GOLD}14` : "transparent",
                          color: active ? GOLD : "#888",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        {preset.label}
                        <span
                          style={{
                            display: "block",
                            fontSize: "11px",
                            fontWeight: 500,
                            color: active ? `${GOLD}aa` : "#555",
                            marginTop: "2px",
                          }}
                        >
                          {preset.costMultiplier === 1
                            ? "baseline"
                            : `~${preset.costMultiplier}x slower`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={handleSplit}
                disabled={running || !hasSource}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: running || !hasSource ? "default" : "pointer",
                  opacity: running || !hasSource ? 0.5 : 1,
                  background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                  color: "#0a0a0a",
                }}
              >
                {running
                  ? stage || "Working…"
                  : user
                    ? "Split Into Stems"
                    : "Sign In to Split"}
              </button>

              {/* Progress */}
              {running && (
                <div style={{ marginTop: "18px" }}>
                  <div
                    style={{
                      height: "6px",
                      background: "#1a1816",
                      borderRadius: "100px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.round(
                          (stage === "Separating"
                            ? separatePct
                            : (downloadPct ?? 0)) * 100,
                        )}%`,
                        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                        transition: "width .2s ease",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "#777",
                      marginTop: "8px",
                    }}
                  >
                    <span>
                      {stage === "Separating"
                        ? `Separating — ${Math.round(separatePct * 100)}%`
                        : downloadPct != null
                          ? `Downloading model — ${Math.round(downloadPct * 100)}%`
                          : downloadedBytes
                            ? `Downloading model — ${formatMb(downloadedBytes)}`
                            : stage}
                    </span>
                    <span>{formatDuration(elapsed)}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
                    Keep this tab open — the separation runs here, on your computer.
                  </div>
                </div>
              )}

              {error && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "#2a1212",
                    border: "1px solid #4a1f1f",
                    color: "#ff9b9b",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Results */}
              {stems.length > 0 && (
                <div style={{ marginTop: "28px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#666",
                      marginBottom: "14px",
                    }}
                  >
                    Your stems
                    {lastRun &&
                      ` · ${formatDuration(lastRun.seconds)} on ${
                        lastRun.backend === "webgpu" ? "GPU" : "CPU"
                      }`}
                  </div>
                  {stems.map((stem) => (
                    <div
                      key={stem.name}
                      style={{
                        border: "1px solid #1f1d1a",
                        borderRadius: "12px",
                        padding: "14px 16px",
                        marginBottom: "10px",
                        background: "#0e0d0c",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: "14px" }}>
                          {stem.label}
                        </span>
                        <button
                          onClick={() =>
                            triggerDownload(
                              stem.url,
                              `${baseName} (${stem.label}).wav`,
                            )
                          }
                          style={{
                            background: "transparent",
                            border: `1px solid ${GOLD}55`,
                            color: GOLD,
                            borderRadius: "8px",
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Download
                        </button>
                      </div>
                      <audio
                        controls
                        src={stem.url}
                        style={{ width: "100%", height: "34px" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Footer meta */}
              <div
                style={{
                  marginTop: "22px",
                  paddingTop: "18px",
                  borderTop: "1px solid #1a1816",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                <span>
                  {!user
                    ? "Sign in to start splitting"
                    : remaining == null
                      ? "Unlimited splits"
                      : `${remaining} free splits left today`}
                </span>
                {modelCached && (
                  <button
                    onClick={() => {
                      void clearModelCache().then(() => setModelCached(false));
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#666",
                      fontSize: "12px",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Clear cached model ({MODEL_SIZE_LABEL})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
