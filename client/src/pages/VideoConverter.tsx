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
            opacity: 0.6,
            position: "relative",
          }}
        />

        {/* Left Divider */}
        <div style={{ background: "#C9A84C", width: "2px" }} />

        {/* Center Panel - Converter UI */}
        <div
          style={{
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 40px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Back link */}
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
                alignSelf: "flex-start",
                marginBottom: "32px",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#fff")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#555")
              }
            >
              ← Back
            </span>
          </Link>

          {/* Header */}
          <div style={{ maxWidth: "400px", marginBottom: "40px" }}>
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
                marginBottom: "16px",
              }}
            >
              Video Converter
            </div>
            <h1
              style={{
                fontSize: "42px",
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                margin: "0 0 12px",
              }}
            >
              Any Link.
              <br />
              <span style={{ color: "#555" }}>Any Format.</span>
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Paste a YouTube URL or video link and download as audio or video.
            </p>
          </div>

          {/* Converter Card */}
          <div
            style={{
              width: "100%",
              maxWidth: "380px",
              background: "#0a0a0a",
              border: "1px solid #1a1a1a",
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            {/* URL Input */}
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#888",
                marginBottom: "8px",
              }}
            >
              Video URL
            </label>
            <input
              placeholder="Paste YouTube URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: "100%",
                background: "#000",
                border: "1px solid #222",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "14px",
                color: "#fff",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: "20px",
              }}
            />

            {/* Format Selection */}
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#888",
                marginBottom: "8px",
              }}
            >
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{
                width: "100%",
                background: "#000",
                border: "1px solid #222",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "14px",
                color: "#fff",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: "20px",
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
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  color: "#f87171",
                  marginBottom: "16px",
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
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  color: "#4ade80",
                  marginBottom: "16px",
                  wordBreak: "break-all",
                }}
              >
                ✓ {success}
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#0e3a42" : ACCENT,
                color: "#000",
                fontSize: "12px",
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
                fontSize: "11px",
                color: "#444",
                lineHeight: 1.5,
                marginTop: "16px",
                marginBottom: 0,
              }}
            >
              Downloads run on our server. Only download content you own or have rights to use.
            </p>
          </div>
        </div>

        {/* Right Divider */}
        <div style={{ background: "#C9A84C", width: "2px" }} />

        {/* Right Panel - Brick Texture */}
        <div
          style={{
            background: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            opacity: 0.6,
            position: "relative",
            transform: "scaleX(-1)",
          }}
        />
      </div>
    </div>
  );
}
