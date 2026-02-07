import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const COINBASE_WEBHOOK_SECRET = Deno.env.get("COINBASE_WEBHOOK_SECRET");

serve(async (req) => {
  try {
    const signature = req.headers.get("X-CC-Webhook-Signature");
    const body = await req.text();

    // Verify webhook signature
    if (!signature) {
      console.error("No signature provided");
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse the webhook payload
    const event = JSON.parse(body);
    console.log("Received Coinbase webhook:", event.type);

    // Only process confirmed payments
    if (event.type === "charge:confirmed") {
      const charge = event.data;
      const metadata = charge.metadata;

      console.log("Processing confirmed charge:", charge.code);

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Parse items from metadata
      const items = JSON.parse(metadata.items || "[]");

      // Create order in database
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: metadata.userId,
        payment_method: "crypto",
        transaction_id: charge.code,
        items: items,
        subtotal: parseFloat(charge.pricing.local.amount),
        tax: 0,
        total: parseFloat(charge.pricing.local.amount),
        status: "completed",
      });

      if (orderError) {
        console.error("Error saving order:", orderError);
        throw orderError;
      }

      // Check if subscription in cart
      const subscriptionItem = items.find((item: any) =>
        item.id.startsWith("subscription-"),
      );

      if (subscriptionItem && metadata.userId) {
        let newTier = "tier_zero";

        if (subscriptionItem.id === "subscription-gold") {
          newTier = "gold";
        } else if (subscriptionItem.id === "subscription-diamond") {
          newTier = "diamond";
        } else if (subscriptionItem.id === "subscription-platinum") {
          newTier = "platinum";
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            subscription_tier: newTier,
            updated_at: new Date().toISOString(),
          })
          .eq("id", metadata.userId);

        if (updateError) {
          console.error("Error updating subscription:", updateError);
        } else {
          console.log("Subscription updated to:", newTier);
        }
      }

      console.log("Order processed successfully");
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
