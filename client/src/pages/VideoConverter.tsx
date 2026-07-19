// client/src/pages/VideoConverter.tsx
import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";

const OUTPUT_FORMATS = [
  { value: "mp3", label: "MP3 (Audio)" },
  { value: "wav", label: "WAV (Audio)" },
  { value: "m4a", label: "M4A (Audio)" },
  { value: "mp4", label: "MP4 (Video)" },
  { value: "webm", label: "WebM (Video)" },
];

const ACCENT = "#22d3ee";

export default function VideoConverter() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleConvert = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // TODO: wire to backend /api/convert (yt-dlp + ffmpeg) once deployed
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), format }),
      });

      if (!response.ok) throw new Error("Conversion failed");

      const data = await response.json();
      setSuccess(`Conversion started! Download link: ${data.downloadUrl}`);
      setUrl("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during conversion"
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

      {/* Ambient glow top */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(34,211,238,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "720px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Back link */}
        <div style={{ paddingTop: "96px" }}>
          <Link href="/tools">
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#555",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#fff")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#555")
              }
            >
              ← Back to Tools
            </span>
          </Link>
        </div>

        {/* Header */}
        <div style={{ paddingTop: "32px", paddingBottom: "48px" }}>
          <div
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: ACCENT,
              border: `1px solid ${ACCENT}55`,
              borderRadius: "100px",
              padding: "5px 16px",
              marginBottom: "24px",
            }}
          >
            Video Converter
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
            }}
          >
            Any Link.
            <br />
            <span style={{ color: "#555" }}>Any Format.</span>
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "460px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Paste a YouTube URL or any video link and download it as audio or
            video in your preferred format.
          </p>
        </div>

        {/* Converter Card */}
        <div
          style={{
            background: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "64px",
          }}
        >
          {/* URL Input */}
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#888",
              marginBottom: "10px",
            }}
          >
            Video URL
          </label>
          <input
            placeholder="Paste YouTube URL or any video link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%",
              background: "#000",
              border: "1px solid #222",
              borderRadius: "10px",
              padding: "14px 16px",
              fontSize: "15px",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "24px",
            }}
          />

          {/* Format Selection */}
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#888",
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
              border: "1px solid #222",
              borderRadius: "10px",
              padding: "14px 16px",
              fontSize: "15px",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "24px",
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
                padding: "12px 16px",
                fontSize: "14px",
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
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#4ade80",
                marginBottom: "20px",
                wordBreak: "break-all",
              }}
            >
              {success}
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: loading ? "#0e3a42" : ACCENT,
              color: "#000",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "none",
              borderRadius: "100px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s ease",
            }}
          >
            {loading ? "Converting..." : "Convert"}
          </button>

          {/* Info note */}
          <p
            style={{
              fontSize: "12px",
              color: "#444",
              lineHeight: 1.6,
              marginTop: "20px",
              marginBottom: 0,
            }}
          >
            Conversion runs on our server — you'll get a download link when it's
            ready. Only download content you have the rights to use.
          </p>
        </div>
      </div>
    </div>
  );
}
