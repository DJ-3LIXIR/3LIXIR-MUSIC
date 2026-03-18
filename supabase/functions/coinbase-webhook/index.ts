import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const COINBASE_WEBHOOK_SECRET = Deno.env.get("COINBASE_WEBHOOK_SECRET");

async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = new Uint8Array(
      signature.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );

    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(payload)
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

serve(async (req) => {
  try {
    const signature = req.headers.get("X-CC-Webhook-Signature");
    const body = await req.text();

    console.log("Received webhook, signature:", signature ? "present" : "missing");

    if (!signature || !COINBASE_WEBHOOK_SECRET) {
      console.error("Missing signature or webhook secret");
      return new Response("Unauthorized", { status: 401 });
    }

    const isValid = await verifySignature(body, signature, COINBASE_WEBHOOK_SECRET);
    
    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    console.log("✓ Signature verified");

    const event = JSON.parse(body);
    console.log("Webhook event type:", event.type);

    if (event.type === "charge:confirmed") {
      const charge = event.data;
      const metadata = charge.metadata;

      console.log("Processing confirmed charge:", charge.code);

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      let items = [];
      try {
        items = JSON.parse(metadata.items || "[]");
      } catch (e) {
        console.error("Error parsing items:", e);
      }

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

      console.log("✓ Order saved successfully");

      // Generate product keys for plugin items
      const pluginItems = items.filter((item: any) => item.type === "plugin");
      if (pluginItems.length > 0) {
        try {
          const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
          const generateKeyResponse = await fetch(
            `${supabaseUrl}/functions/v1/generate-product-key`,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: charge.code,
                userId: metadata.userId,
                items: pluginItems,
              }),
            }
          );

          const keyResult = await generateKeyResponse.json();
          if (generateKeyResponse.ok) {
            console.log("✓ Product keys generated:", keyResult);
          } else {
            console.error("Error generating product keys:", keyResult);
          }
        } catch (keyError) {
          console.error("Error calling generate-product-key:", keyError);
        }
      }

      const subscriptionItem = items.find((item: any) =>
        item.id?.startsWith("subscription-")
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
          console.log("✓ Subscription updated to:", newTier);
        }
      }

      console.log("✓ Payment processing complete");
    } else if (event.type === "charge:failed") {
      console.log("Charge failed:", event.data?.code);
    } else if (event.type === "charge:pending") {
      console.log("Charge pending:", event.data?.code);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
