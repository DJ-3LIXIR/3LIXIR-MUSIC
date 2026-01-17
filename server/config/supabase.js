import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Client for regular operations (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for service operations (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Helper function to get user from auth header
export const getUserFromToken = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting user from token:", error);
    return null;
  }
};

// Helper function to check if user is admin
export const isAdmin = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return data?.is_admin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Helper function to check if user is support agent
export const isSupportAgent = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_support_agent, is_admin")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking support agent status:", error);
      return false;
    }

    return data?.is_support_agent === true || data?.is_admin === true;
  } catch (error) {
    console.error("Error checking support agent status:", error);
    return false;
  }
};
