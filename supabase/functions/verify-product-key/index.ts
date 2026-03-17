// verify-product-key — called by the 3LIXIR Loader app to validate a product key
// Returns the plugin info if the key is valid, or an error if not

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { key, userId } = await req.json();

    if (!key) {
      return new Response(
        JSON.stringify({ valid: false, error: "Missing product key" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Look up the key
    const { data: productKey, error } = await supabase
      .from("product_keys")
      .select("*")
      .eq("key_value", key.trim().toUpperCase())
      .maybeSingle();

    if (error || !productKey) {
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid product key" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if key is active
    if (productKey.status !== "active") {
      return new Response(
        JSON.stringify({
          valid: false,
          error: `Product key has been ${productKey.status}`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Optional: verify the key belongs to the requesting user
    if (userId && productKey.user_id !== userId) {
      return new Response(
        JSON.stringify({ valid: false, error: "Product key does not belong to this account" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as activated if first time
    if (!productKey.activated_at) {
      await supabase
        .from("product_keys")
        .update({
          activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", productKey.id);
    }

    return new Response(
      JSON.stringify({
        valid: true,
        plugin_id: productKey.plugin_id,
        plugin_name: productKey.plugin_name,
        activated_at: productKey.activated_at || new Date().toISOString(),
        user_id: productKey.user_id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying product key:", error);
    return new Response(
      JSON.stringify({ valid: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
