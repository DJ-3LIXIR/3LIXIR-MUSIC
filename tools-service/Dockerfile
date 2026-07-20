# 3LIXIR tools backend — Node + ffmpeg + yt-dlp
# Node 22 (native WebSocket — required by @supabase/supabase-js realtime client)
FROM node:22-slim

# System deps: ffmpeg (conversion), yt-dlp (standalone binary), deno (JS runtime
# that yt-dlp needs to solve YouTube's JS challenges).
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg ca-certificates curl unzip \
  && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux \
       -o /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp \
  && curl -fsSL https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip \
       -o /tmp/deno.zip \
  && unzip /tmp/deno.zip -d /usr/local/bin \
  && chmod a+rx /usr/local/bin/deno \
  && rm /tmp/deno.zip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production
# Render sets PORT; default for local runs
ENV PORT=3001
EXPOSE 3001

CMD ["node", "src/index.js"]
