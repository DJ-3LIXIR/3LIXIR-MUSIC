import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";

const macSteps = [
  "Click Download for Mac on the Loader page.",
  "Open the downloaded .dmg file and drag 3LIXIR Loader into Applications.",
  "Open 3LIXIR Loader from Applications.",
  "If macOS blocks first launch, go to System Settings > Privacy & Security and choose Open Anyway.",
  "Sign in with your 3LIXIR account, then install your plugins from the library.",
];

const windowsSteps = [
  "Click Download for PC on the Loader page.",
  "Run the downloaded installer (.exe) as administrator.",
  "Follow the setup prompts and complete installation.",
  "Launch 3LIXIR Loader from Start Menu/Desktop.",
  "Sign in with your 3LIXIR account, then install your plugins from the library.",
];

export default function LoaderInstallGuide() {
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

      <div
        style={{
          position: "fixed",
          top: "-180px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "420px",
          background: "radial-gradient(ellipse, rgba(34,197,94,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative" }}>
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

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "96px 24px 100px" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#22c55e",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "100px",
                padding: "6px 16px",
                marginBottom: "24px",
              }}
            >
              3LIXIR Loader Guide
            </div>
            <h1 style={{ fontSize: "clamp(40px, 7vw, 76px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.0, margin: "0 0 18px" }}>
              Download & Install
              <br />
              <span style={{ color: "#22c55e" }}>3LIXIR Loader</span>
            </h1>
            <p style={{ fontSize: "17px", color: "#777", margin: "0 auto", maxWidth: "680px", lineHeight: 1.7 }}>
              A quick step-by-step install guide for macOS and Windows, plus first-launch checks to get your plugins running fast.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "34px" }}>
            <div style={{ background: "#080808", border: "1px solid #111", borderRadius: "16px", padding: "30px" }}>
              <div style={{ fontSize: "12px", color: "#22c55e", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, marginBottom: "14px" }}>
                macOS Install
              </div>
              <ol style={{ margin: 0, paddingLeft: "20px", color: "#bdbdbd", lineHeight: 1.8, fontSize: "14px" }}>
                {macSteps.map((step) => (
                  <li key={step} style={{ marginBottom: "8px" }}>{step}</li>
                ))}
              </ol>
            </div>

            <div style={{ background: "#080808", border: "1px solid #111", borderRadius: "16px", padding: "30px" }}>
              <div style={{ fontSize: "12px", color: "#22c55e", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, marginBottom: "14px" }}>
                Windows Install
              </div>
              <ol style={{ margin: 0, paddingLeft: "20px", color: "#bdbdbd", lineHeight: 1.8, fontSize: "14px" }}>
                {windowsSteps.map((step) => (
                  <li key={step} style={{ marginBottom: "8px" }}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div style={{ background: "#0a0a0a", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "26px", marginBottom: "26px" }}>
            <div style={{ fontSize: "12px", color: "#22c55e", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, marginBottom: "12px" }}>
              First-Launch Checks
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", color: "#bdbdbd", lineHeight: 1.8, fontSize: "14px" }}>
              <li>Make sure you are signed into the same 3LIXIR account used for purchases.</li>
              <li>If your DAW was open during install, close and reopen it to refresh plugin scan.</li>
              <li>If a plugin does not appear, restart the Loader, then run your DAW's plugin rescan.</li>
            </ul>
          </div>

          <div style={{ background: "#0a0a0a", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "16px", padding: "26px", marginBottom: "26px" }}>
            <div style={{ fontSize: "12px", color: "#22c55e", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, marginBottom: "12px" }}>
              macOS De-Quarantine (If App Is Blocked)
            </div>
            <p style={{ margin: "0 0 12px 0", color: "#bdbdbd", fontSize: "14px", lineHeight: 1.7 }}>
              If macOS blocks 3LIXIR Loader with a security warning, remove the quarantine flag using Terminal:
            </p>
            <pre
              style={{
                margin: "0 0 14px 0",
                background: "#060606",
                border: "1px solid #151515",
                borderRadius: "10px",
                padding: "14px",
                color: "#9ef0b7",
                fontSize: "13px",
                overflowX: "auto",
              }}
            >
{`sudo xattr -rd com.apple.quarantine "/Applications/3LIXIR Loader.app"`}
            </pre>
            <ol style={{ margin: 0, paddingLeft: "20px", color: "#bdbdbd", lineHeight: 1.8, fontSize: "14px" }}>
              <li>Close the Loader app if it is open.</li>
              <li>Open Terminal, paste the command above, and press Enter.</li>
              <li>Enter your Mac password when prompted.</li>
              <li>Reopen 3LIXIR Loader from Applications.</li>
            </ol>
          </div>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link href="/loader">
              <button style={{ padding: "14px 24px", borderRadius: "999px", border: "none", background: "#22c55e", color: "#000", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "12px", cursor: "pointer" }}>
                Back to Loader
              </button>
            </Link>
            <a href="https://support.ujam.com/hc/en-us/articles/22567195167260-Resolving-Plugin-Issues-in-Logic-Pro" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", padding: "14px 24px", borderRadius: "999px", border: "1px solid rgba(34,197,94,0.4)", color: "#22c55e", textDecoration: "none", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "12px" }}>
              Reference Support Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
