# 3LIXIR tools backend — Node + ffmpeg + yt-dlp
FROM node:20-slim

# System deps: ffmpeg for conversion, yt-dlp (standalone Linux binary, no python needed)
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg ca-certificates curl \
  && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux \
       -o /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp \
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
