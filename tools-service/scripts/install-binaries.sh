#!/usr/bin/env bash
# Install ffmpeg, ffprobe, yt-dlp and deno into tools-service/bin.
#
# The Dockerfile installs these system-wide. This script exists for when the
# service is built on Render's native Node runtime instead, which ships none of
# them -- without it the converter, vocal remover and link downloads all fail.
# src/index.js puts ./bin first on PATH when the directory exists.
#
# Render build command (Root Directory: tools-service):
#   npm install && bash scripts/install-binaries.sh
set -euo pipefail

cd "$(dirname "$0")/.."
BIN="$PWD/bin"
mkdir -p "$BIN"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Static Linux x86_64 build from a stable release branch, not "master".
FFMPEG_ASSET="ffmpeg-n8.1-latest-linux64-gpl-8.1"

echo "==> ffmpeg / ffprobe (${FFMPEG_ASSET})"
curl -fsSL \
  "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/${FFMPEG_ASSET}.tar.xz" \
  -o "$TMP/ffmpeg.tar.xz"
if command -v xz >/dev/null 2>&1; then
  tar -xJf "$TMP/ffmpeg.tar.xz" -C "$TMP" \
    "${FFMPEG_ASSET}/bin/ffmpeg" "${FFMPEG_ASSET}/bin/ffprobe"
else
  # No xz on the build image: python's tarfile reads .tar.xz natively.
  python3 - "$TMP/ffmpeg.tar.xz" "$TMP" "$FFMPEG_ASSET" <<'PY'
import sys, tarfile
archive, dest, root = sys.argv[1:]
with tarfile.open(archive, "r:xz") as tar:
    for name in ("ffmpeg", "ffprobe"):
        tar.extract(f"{root}/bin/{name}", dest)
PY
fi
cp "$TMP/${FFMPEG_ASSET}/bin/ffmpeg" "$TMP/${FFMPEG_ASSET}/bin/ffprobe" "$BIN/"
chmod 755 "$BIN/ffmpeg" "$BIN/ffprobe"

echo "==> yt-dlp"
curl -fsSL https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux \
  -o "$BIN/yt-dlp"
chmod 755 "$BIN/yt-dlp"

echo "==> deno (yt-dlp uses it for YouTube's JS challenges)"
curl -fsSL https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip \
  -o "$TMP/deno.zip"
if command -v unzip >/dev/null 2>&1; then
  unzip -oq "$TMP/deno.zip" -d "$BIN"
else
  python3 -m zipfile -e "$TMP/deno.zip" "$BIN"
fi
chmod 755 "$BIN/deno"

# Fail the build here, not at the first user request, if any binary won't run.
echo "==> verifying"
"$BIN/ffmpeg" -hide_banner -version | head -1
"$BIN/yt-dlp" --version
"$BIN/deno" --version | head -1
