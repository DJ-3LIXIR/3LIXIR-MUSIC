// generate-product-key — called after successful order to create product keys for purchased plugins
// Called from the frontend after order completion or from webhooks

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a product key in format: 3LX-XXXXX-XXXXX-XXXXX
function generateKey(pluginPrefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No 0/O/1/I to avoid confusion
  const segment = () => {
    let s = "";
    for (let i = 0; i < 5; i++) {
      s += chars[Math.floor(Math.random() * chars.length)];
    }
    return s;
  };

  // Create a short prefix from the plugin name (max 5 chars, uppercase)
  const prefix = pluginPrefix
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 5)
    .toUpperCase()
    .padEnd(5, "X");

  return `3LX-${prefix}-${segment()}-${segment()}`;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { orderId, userId, items } = await req.json();

    if (!orderId || !userId || !items || !Array.isArray(items)) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: orderId, userId, items" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter for plugin items only
    const pluginItems = items.filter(
      (item: any) => item.type === "plugin"
    );

    if (pluginItems.length === 0) {
      return new Response(
        JSON.stringify({ message: "No plugin items in order", keys: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const generatedKeys: any[] = [];

    for (const plugin of pluginItems) {
      // Check if a key already exists for this order + plugin combo (idempotency)
      const { data: existingKey } = await supabase
        .from("product_keys")
        .select("*")
        .eq("order_id", orderId)
        .eq("plugin_id", String(plugin.id))
        .eq("user_id", userId)
        .maybeSingle();

      if (existingKey) {
        generatedKeys.push(existingKey);
        continue;
      }

      // Generate a unique key (retry up to 5 times for uniqueness)
      let keyValue = "";
      let attempts = 0;
      while (attempts < 5) {
        keyValue = generateKey(plugin.title || plugin.name || "PLUGIN");
        const { data: collision } = await supabase
          .from("product_keys")
          .select("id")
          .eq("key_value", keyValue)
          .maybeSingle();

        if (!collision) break;
        attempts++;
      }

      const { data: newKey, error } = await supabase
        .from("product_keys")
        .insert({
          order_id: orderId,
          plugin_id: String(plugin.id),
          plugin_name: plugin.title || plugin.name || "Unknown Plugin",
          user_id: userId,
          key_value: keyValue,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creating key for plugin ${plugin.id}:`, error);
        continue;
      }

      generatedKeys.push(newKey);
    }

    return new Response(
      JSON.stringify({ success: true, keys: generatedKeys }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating product keys:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
