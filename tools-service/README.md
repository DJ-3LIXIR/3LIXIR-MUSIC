# 3LIXIR Tools Service

Shared backend for the producer tools (Video Converter now, Sample Digger later).
Node + Express, with `ffmpeg` + `yt-dlp` in the container. Deploys to **Render**
as a Docker service (flat ~$7/mo instance). Quota is enforced against Supabase.

## Endpoints

- `GET  /` — health check
- `POST /api/convert` — body: `{ url, format }` (JSON) **or** multipart `file` + `format`.
  Requires `Authorization: Bearer <supabase access token>`. Returns `{ downloadUrl, remaining }`.
- `GET  /api/download/:file` — streams a finished file (auto-deleted after 1 hour).

Free limits: **10 conversions/day**, **25 digs/day** (members unlimited).

## 1. Supabase setup (run once in the SQL editor)

```sql
-- Daily per-user, per-tool usage counter
create table if not exists tool_usage (
  user_id uuid not null,
  tool    text not null,
  used_on date not null default current_date,
  count   int  not null default 0,
  primary key (user_id, tool, used_on)
);

-- Atomic increment; returns the new count for today
create or replace function increment_tool_usage(p_user uuid, p_tool text)
returns int
language plpgsql
security definer
as $$
declare
  new_count int;
begin
  insert into tool_usage (user_id, tool, used_on, count)
  values (p_user, p_tool, current_date, 1)
  on conflict (user_id, tool, used_on)
  do update set count = tool_usage.count + 1
  returning count into new_count;
  return new_count;
end;
$$;
```

The service reads `profiles.subscription_tier` to detect members (any tier that is
not `tier_zero` / `black` = unlimited).

## 2. Deploy to Render

1. Push this repo to GitHub (already connected).
2. Render → **New → Web Service** → pick the repo.
3. **Root Directory:** `tools-service`
4. **Runtime:** Docker (Render auto-detects the `Dockerfile`).
5. **Instance type:** Starter ($7/mo, always-on).
6. **Environment variables** (from `.env.example`):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (secret)
   - `FRONTEND_ORIGIN` (your Vercel domain(s), comma-separated)
7. Deploy. Copy the service URL, e.g. `https://3lixir-tools.onrender.com`.

## 3. Wire the frontend

Set `VITE_TOOLS_API_URL` on Vercel to the Render URL, and the tool pages will
send requests (with the user's Supabase token) there. See the frontend TODO.

## Local dev

```bash
cp .env.example .env   # fill in values
npm install
# needs ffmpeg + yt-dlp installed locally, or just run via Docker:
docker build -t tools-service . && docker run -p 3001:3001 --env-file .env tools-service
```
