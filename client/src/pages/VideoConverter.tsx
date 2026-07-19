// client/src/pages/VideoConverter.tsx
import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";

const OUTPUT_FORMATS = [
  { value: "mp3", label: "MP3 · Audio" },
  { value: "wav", label: "WAV · Audio" },
  { value: "m4a", label: "M4A · Audio" },
  { value: "mp4", label: "MP4 · Video" },
  { value: "webm", label: "WebM · Video" },
];

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#e8c76a";

export default function VideoConverter() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [urlFocused, setUrlFocused] = useState(false);

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
                Video Converter
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
                Any Link.
                <br />
                <span
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Any Format.
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
                Paste a YouTube URL or any video link and pull it down as clean
                audio or video — MP3, WAV, MP4 and more.
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
                onChange={(e) => setUrl(e.target.value)}
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
                  marginBottom: "24px",
                  transition: "border-color 0.2s",
                }}
              />

              {/* Format Selection */}
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
                {loading ? "Converting..." : "Convert & Download"}
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
                Downloads run on our server. Only download content you own or
                have the rights to use.
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
