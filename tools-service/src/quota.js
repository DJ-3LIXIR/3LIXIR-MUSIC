// Supabase-backed user identity + daily usage quota.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client that validates a user's JWT (anon key).
const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

// Admin client (service role) — reads profiles + writes usage, bypassing RLS.
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Tiers that count as "free" (everything else = member with unlimited usage).
// Mirrors the convention used on the frontend / VIP pages.
const FREE_TIERS = new Set(["tier_zero", "black", ""]);

/**
 * Verify a Supabase access token and determine membership.
 * @returns {{ user: object|null, isMember: boolean }}
 */
export async function getUserContext(token) {
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data?.user) return { user: null, isMember: false };

  const user = data.user;
  const { data: profile } = await admin
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .maybeSingle();

  const tier = (profile?.subscription_tier || "").toLowerCase();
  return { user, isMember: !FREE_TIERS.has(tier) };
}

/** Conversions/digs already used today for a given tool. */
export async function getUsageToday(userId, tool) {
  const { data } = await admin
    .from("tool_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("tool", tool)
    .eq("used_on", todayUTC())
    .maybeSingle();
  return data?.count || 0;
}

/** Atomically increment today's usage; returns the new count. */
export async function incrementUsage(userId, tool) {
  const { data, error } = await admin.rpc("increment_tool_usage", {
    p_user: userId,
    p_tool: tool,
  });
  if (error) throw error;
  return data;
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}
