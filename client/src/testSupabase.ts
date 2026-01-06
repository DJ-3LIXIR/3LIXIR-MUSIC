import { supabase } from "./supabaseClient";

// Test the connection
async function testConnection() {
  console.log("Testing Supabase connection...");

  // Try to fetch from the profiles table
  const { data, error } = await supabase.from("profiles").select("*").limit(5);

  if (error) {
    console.error("Error connecting to Supabase:", error);
  } else {
    console.log("Connected successfully! Profiles:", data);
  }
}

testConnection();
