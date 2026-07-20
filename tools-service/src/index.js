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

// --- Sample Digger (Discogs) config ---------------------------------------
// Free personal access token: discogs.com → Settings → Developers.
const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN || "";
const DISCOGS_UA = "3LIXIR-Tools/1.0 (+https://3-lixir-music.vercel.app)";
// Genres we randomly dig through (Discogs top-level genres).
const DIG_GENRES = [
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

const FILE_TTL_MS = 3 * 60 * 60 * 1000; // keep converted files 3 hours

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

    // Each job gets its own directory, so the output keeps its real name
    // (the YouTube title, or the uploaded file's name) for the download.
    const id = randomUUID();
    const jobDir = path.join(OUT_DIR, id);
    await fsp.mkdir(jobDir, { recursive: true });

    if (uploadPath) {
      // Local file upload → ffmpeg transcode, keep the original base name.
      const base =
        safeName(path.parse(req.file.originalname || "converted").name) ||
        "converted";
      const outPath = path.join(jobDir, `${base}.${format}`);
      await execFileP(
        "ffmpeg",
        ["-y", "-i", uploadPath, ...ffmpegArgs(format), outPath],
        { timeout: 10 * 60 * 1000 }
      );
    } else {
      const url = String(req.body.url || "").trim();
      if (!url) return res.status(400).json({ error: "No URL or file provided" });
      await downloadAndConvert(url, format, jobDir);
    }

    // The produced file is named by title / original name.
    const produced = (await fsp.readdir(jobDir)).filter(
      (f) => !f.endsWith(".part")
    );
    if (!produced.length) throw new Error("Conversion produced no file");
    const filename = produced[0];

    // Consume quota only on success. A quota-recording failure (e.g. a bad
    // service-role key) must NOT discard an already-finished conversion.
    let remaining = null;
    if (!isMember) {
      try {
        const count = await incrementUsage(user.id, "convert");
        remaining = Math.max(0, LIMITS.convert - count);
      } catch (e) {
        console.error(
          "[convert] quota update failed (check SUPABASE_SERVICE_ROLE_KEY):",
          e?.message || e
        );
      }
    }

    res.json({ downloadUrl: `/api/download/${id}`, filename, remaining });
  } catch (err) {
    console.error("[convert]", err);
    res.status(500).json({ error: "Conversion failed. Check the URL and try again." });
  } finally {
    if (uploadPath) await fsp.unlink(uploadPath).catch(() => {});
  }
});

// Serve (and let the browser download) a finished file by job id. The browser
// saves it under its real name via the Content-Disposition header.
app.get("/api/download/:id", async (req, res) => {
  const id = path.basename(req.params.id);
  const jobDir = path.join(OUT_DIR, id);
  let files;
  try {
    files = (await fsp.readdir(jobDir)).filter((f) => !f.endsWith(".part"));
  } catch {
    return res.status(404).json({ error: "File not found or expired" });
  }
  if (!files.length) {
    return res.status(404).json({ error: "File not found or expired" });
  }
  res.download(path.join(jobDir, files[0]), files[0]);
});

// --- Sample Digger ---------------------------------------------------------
// Returns a random Discogs release that has an associated YouTube video.
app.post("/api/dig", async (req, res) => {
  try {
    const token = bearerToken(req);
    if (!token) return res.status(401).json({ error: "Sign in required" });

    const { user, isMember } = await getUserContext(token);
    if (!user) return res.status(401).json({ error: "Invalid session" });

    if (!DISCOGS_TOKEN) {
      return res.status(503).json({ error: "Digger not configured yet" });
    }

    // Quota check (25/day free; members unlimited).
    if (!isMember) {
      const used = await getUsageToday(user.id, "dig");
      if (used >= LIMITS.dig) {
        return res
          .status(429)
          .json({ error: "Daily free limit reached", remaining: 0 });
      }
    }

    const track = await digRandomTrack(req.body || {});

    // Consume quota (non-fatal on failure).
    let remaining = null;
    if (!isMember) {
      try {
        const count = await incrementUsage(user.id, "dig");
        remaining = Math.max(0, LIMITS.dig - count);
      } catch (e) {
        console.error("[dig] quota update failed:", e?.message || e);
      }
    }

    res.json({ track, remaining });
  } catch (err) {
    console.error("[dig]", err);
    res.status(502).json({ error: "Couldn't find a track. Try digging again." });
  }
});

// --- helpers ---------------------------------------------------------------
// Strip characters that are unsafe in filenames / HTTP headers.
function safeName(s) {
  return String(s)
    .replace(/[/\\?%*:|"<>\n\r]/g, "")
    .trim()
    .slice(0, 120);
}

// Fetch JSON from the Discogs API with auth + required User-Agent.
async function discogs(pathAndQuery) {
  const r = await fetch(`https://api.discogs.com${pathAndQuery}`, {
    headers: {
      "User-Agent": DISCOGS_UA,
      Authorization: `Discogs token=${DISCOGS_TOKEN}`,
    },
  });
  if (!r.ok) throw new Error(`Discogs ${r.status}`);
  return r.json();
}

// Extract an 11-char YouTube video id from a URL.
function ytId(url) {
  const m = String(url).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function shuffleArr(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Pick a random release matching the filters that has a YouTube video.
// Filters (all optional): { genre, style, country, yearMin, yearMax, q }.
async function digRandomTrack(f = {}) {
  const narrowed = f.genre || f.style || f.country || f.q || f.yearMin || f.yearMax;

  for (let attempt = 0; attempt < 5; attempt++) {
    const params = new URLSearchParams({ type: "release", per_page: "50" });

    // With no filters at all, pick a random genre so results feel like digging.
    const genre =
      f.genre ||
      (narrowed ? "" : DIG_GENRES[Math.floor(Math.random() * DIG_GENRES.length)]);
    if (genre) params.set("genre", genre);
    if (f.style) params.set("style", String(f.style));
    if (f.country) params.set("country", String(f.country));
    if (f.q) params.set("q", String(f.q));

    // Discogs year is a single value — pick a random year within the range.
    const yMin = parseInt(f.yearMin, 10);
    const yMax = parseInt(f.yearMax, 10);
    if (!Number.isNaN(yMin) || !Number.isNaN(yMax)) {
      const lo = Number.isNaN(yMin) ? 1900 : yMin;
      const hi = Number.isNaN(yMax) ? new Date().getFullYear() : yMax;
      const span = Math.max(lo, hi) - lo;
      params.set("year", String(lo + Math.floor(Math.random() * (span + 1))));
    }

    params.set("page", String(1 + Math.floor(Math.random() * 40)));

    const search = await discogs(`/database/search?${params.toString()}`);
    const results = (search.results || []).filter((r) => r.id);
    if (!results.length) continue;

    for (const r of shuffleArr(results).slice(0, 6)) {
      let rel;
      try {
        rel = await discogs(`/releases/${r.id}`);
      } catch {
        continue;
      }
      const vids = (rel.videos || [])
        .map((v) => ({ id: ytId(v.uri), title: v.title }))
        .filter((v) => v.id);
      if (!vids.length) continue;

      const artist =
        (rel.artists || []).map((a) => a.name).join(", ") ||
        rel.artists_sort ||
        "Unknown";
      return {
        artist,
        title: rel.title || "Untitled",
        year: rel.year || null,
        label: (rel.labels || [])[0]?.name || null,
        genre: (rel.genres || []).join(", ") || null,
        style: (rel.styles || []).join(", ") || null,
        country: rel.country || null,
        youtubeId: vids[0].id,
        videoTitle: vids[0].title || null,
        thumb: rel.thumb || (rel.images || [])[0]?.uri150 || null,
        discogsUrl: rel.uri || null,
        // Not available from Discogs — computed later (phase 2).
        musicalKey: null,
        bpm: null,
      };
    }
  }
  throw new Error("No release with a video found");
}

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

// YouTube cookies (Netscape format) let yt-dlp authenticate as a logged-in
// user, which gets past the "confirm you're not a bot" wall from datacenter IPs.
// On Render, upload it as a Secret File named yt-cookies.txt (mounted at
// /etc/secrets/yt-cookies.txt, read-only). Override source with YT_COOKIES_FILE.
//
// yt-dlp rewrites the cookies file when it exits, so we copy the read-only
// secret to a writable temp path and hand yt-dlp that copy instead.
const COOKIES_SRC = process.env.YT_COOKIES_FILE || "/etc/secrets/yt-cookies.txt";
let COOKIES_PATH = null;
if (fs.existsSync(COOKIES_SRC)) {
  try {
    COOKIES_PATH = path.join(os.tmpdir(), "yt-cookies.txt");
    fs.copyFileSync(COOKIES_SRC, COOKIES_PATH);
    console.log(`Using YouTube cookies (writable copy at ${COOKIES_PATH})`);
  } catch (e) {
    console.error("Failed to copy cookies file:", e);
    COOKIES_PATH = null;
  }
} else {
  console.log("No YouTube cookies file found — YouTube may block from this IP.");
}

// Evasion args to improve odds against YouTube's bot/rate-limit blocking from
// datacenter IPs. Cookies (above) are the real fix; these help on top.
const YTDLP_COMMON = [
  ...(COOKIES_PATH ? ["--cookies", COOKIES_PATH] : []),
  "--force-ipv4",
  "--retries",
  "5",
  "--retry-sleep",
  "3",
  "--sleep-requests",
  "1",
  "--user-agent",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "--extractor-args",
  "youtube:player_client=default,web_safari,tv,ios",
];

async function downloadAndConvert(url, format, jobDir) {
  // %(title)s names the file after the video (yt-dlp sanitizes path-illegal chars).
  const template = path.join(jobDir, "%(title)s.%(ext)s");

  if (AUDIO.has(format)) {
    await execFileP(
      "yt-dlp",
      [...YTDLP_COMMON, "-x", "--audio-format", format, "--audio-quality", "0", "-o", template, url],
      { timeout: 10 * 60 * 1000 }
    );
  } else {
    await execFileP(
      "yt-dlp",
      [...YTDLP_COMMON, "-f", "bv*+ba/b", "--merge-output-format", format, "-o", template, url],
      { timeout: 15 * 60 * 1000 }
    );
  }

  // If the single produced file isn't already the requested format, transcode it.
  const files = (await fsp.readdir(jobDir)).filter((f) => !f.endsWith(".part"));
  if (!files.length) throw new Error("Download failed");
  if (files.length === 1 && !files[0].toLowerCase().endsWith(`.${format}`)) {
    const src = path.join(jobDir, files[0]);
    const out = path.join(jobDir, `${path.parse(files[0]).name}.${format}`);
    await execFileP("ffmpeg", ["-y", "-i", src, ...ffmpegArgs(format), out], {
      timeout: 10 * 60 * 1000,
    });
    await fsp.unlink(src).catch(() => {});
  }
}

// Periodic cleanup of expired job directories.
setInterval(async () => {
  try {
    const entries = await fsp.readdir(OUT_DIR, { withFileTypes: true });
    const now = Date.now();
    for (const ent of entries) {
      const p = path.join(OUT_DIR, ent.name);
      const stat = await fsp.stat(p).catch(() => null);
      if (stat && now - stat.mtimeMs > FILE_TTL_MS) {
        await fsp.rm(p, { recursive: true, force: true }).catch(() => {});
      }
    }
  } catch (err) {
    console.error("[cleanup]", err);
  }
}, 15 * 60 * 1000);

app.listen(PORT, () => console.log(`tools-service listening on :${PORT}`));
