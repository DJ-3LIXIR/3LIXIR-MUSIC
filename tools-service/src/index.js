// 3LIXIR tools backend — Video Converter (yt-dlp + ffmpeg) with Supabase quota.
import express from "express";
import cors from "cors";
import multer from "multer";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { getUserContext, getUsageToday, incrementUsage } from "./quota.js";

const execFileP = promisify(execFile);

const PORT = process.env.PORT || 3001;
const OUT_DIR = path.join(os.tmpdir(), "tool-outputs");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Daily free limits per tool (members = unlimited).
const LIMITS = { convert: 10, dig: 25 };

const AUDIO = new Set(["mp3", "wav", "m4a"]);
const VIDEO = new Set(["mp4", "webm"]);

const FILE_TTL_MS = 60 * 60 * 1000; // keep converted files 1 hour

const app = express();

// CORS — restrict to configured origins, or allow all if none set.
const allowed = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: allowed.length ? allowed : true,
  })
);
app.use(express.json());

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 300 * 1024 * 1024 }, // 300 MB cap on uploads
});

function bearerToken(req) {
  const h = req.headers.authorization || "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
}

// Health check
app.get("/", (_req, res) => res.json({ ok: true, service: "3lixir-tools" }));

// --- Video Converter -------------------------------------------------------
app.post("/api/convert", upload.single("file"), async (req, res) => {
  let uploadPath = req.file?.path;
  try {
    const token = bearerToken(req);
    if (!token) return res.status(401).json({ error: "Sign in required" });

    const { user, isMember } = await getUserContext(token);
    if (!user) return res.status(401).json({ error: "Invalid session" });

    const format = String(req.body.format || "mp3").toLowerCase();
    if (!AUDIO.has(format) && !VIDEO.has(format)) {
      return res.status(400).json({ error: "Unsupported format" });
    }

    // Quota check (before doing the work).
    if (!isMember) {
      const used = await getUsageToday(user.id, "convert");
      if (used >= LIMITS.convert) {
        return res
          .status(429)
          .json({ error: "Daily free limit reached", remaining: 0 });
      }
    }

    const id = randomUUID();
    const outPath = path.join(OUT_DIR, `${id}.${format}`);

    if (uploadPath) {
      // Local file upload → ffmpeg transcode.
      await execFileP(
        "ffmpeg",
        ["-y", "-i", uploadPath, ...ffmpegArgs(format), outPath],
        { timeout: 10 * 60 * 1000 }
      );
    } else {
      const url = String(req.body.url || "").trim();
      if (!url) return res.status(400).json({ error: "No URL or file provided" });
      await downloadAndConvert(url, format, id, outPath);
    }

    if (!fs.existsSync(outPath)) throw new Error("Conversion produced no file");

    // Consume quota only on success.
    let remaining = null;
    if (!isMember) {
      const count = await incrementUsage(user.id, "convert");
      remaining = Math.max(0, LIMITS.convert - count);
    }

    res.json({ downloadUrl: `/api/download/${id}.${format}`, remaining });
  } catch (err) {
    console.error("[convert]", err);
    res.status(500).json({ error: "Conversion failed. Check the URL and try again." });
  } finally {
    if (uploadPath) await fsp.unlink(uploadPath).catch(() => {});
  }
});

// Serve (and let the browser download) a finished file.
app.get("/api/download/:file", (req, res) => {
  const file = path.basename(req.params.file);
  const p = path.join(OUT_DIR, file);
  if (!fs.existsSync(p)) {
    return res.status(404).json({ error: "File not found or expired" });
  }
  res.download(p);
});

// --- helpers ---------------------------------------------------------------
function ffmpegArgs(format) {
  switch (format) {
    case "mp3":
      return ["-vn", "-b:a", "192k"];
    case "m4a":
      return ["-vn", "-c:a", "aac", "-b:a", "192k"];
    case "wav":
      return ["-vn"];
    case "mp4":
      return ["-c:v", "libx264", "-c:a", "aac"];
    case "webm":
      return ["-c:v", "libvpx-vp9", "-c:a", "libopus"];
    default:
      return [];
  }
}

async function downloadAndConvert(url, format, id, outPath) {
  const template = path.join(OUT_DIR, `${id}.%(ext)s`);

  if (AUDIO.has(format)) {
    await execFileP(
      "yt-dlp",
      ["-x", "--audio-format", format, "--audio-quality", "0", "-o", template, url],
      { timeout: 10 * 60 * 1000 }
    );
  } else {
    await execFileP(
      "yt-dlp",
      ["-f", "bv*+ba/b", "--merge-output-format", format, "-o", template, url],
      { timeout: 15 * 60 * 1000 }
    );
  }

  // yt-dlp usually lands the file at <id>.<format>.
  const expected = path.join(OUT_DIR, `${id}.${format}`);
  if (fs.existsSync(expected)) {
    if (expected !== outPath) await fsp.rename(expected, outPath);
    return;
  }

  // Fallback: find whatever <id>.* was produced and transcode it.
  const files = await fsp.readdir(OUT_DIR);
  const match = files.find((f) => f.startsWith(`${id}.`));
  if (!match) throw new Error("Download failed");

  const src = path.join(OUT_DIR, match);
  await execFileP(
    "ffmpeg",
    ["-y", "-i", src, ...ffmpegArgs(format), outPath],
    { timeout: 10 * 60 * 1000 }
  );
  await fsp.unlink(src).catch(() => {});
}

// Periodic cleanup of expired output files.
setInterval(async () => {
  try {
    const files = await fsp.readdir(OUT_DIR);
    const now = Date.now();
    for (const f of files) {
      const p = path.join(OUT_DIR, f);
      const stat = await fsp.stat(p).catch(() => null);
      if (stat && now - stat.mtimeMs > FILE_TTL_MS) {
        await fsp.unlink(p).catch(() => {});
      }
    }
  } catch (err) {
    console.error("[cleanup]", err);
  }
}, 15 * 60 * 1000);

app.listen(PORT, () => console.log(`tools-service listening on :${PORT}`));
