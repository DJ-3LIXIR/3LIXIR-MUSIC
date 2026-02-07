import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PAYPAL_WEBHOOK_ID = Deno.env.get("PAYPAL_WEBHOOK_ID");
const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID");
const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET");
const PAYPAL_MODE = Deno.env.get("PAYPAL_MODE") || "sandbox";

const PAYPAL_API_BASE = PAYPAL_MODE === "live" 
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function verifyWebhookSignature(
  webhookId: string,
  headers: Headers,
  body: string
): Promise<boolean> {
  try {
    // Get PayPal access token
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
    const tokenResponse = await fetch(
      `${PAYPAL_API_BASE}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const { access_token } = await tokenResponse.json();

    // Verify webhook signature
    const verifyResponse = await fetch(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          transmission_id: headers.get("paypal-transmission-id"),
          transmission_time: headers.get("paypal-transmission-time"),
          cert_url: headers.get("paypal-cert-url"),
          auth_algo: headers.get("paypal-auth-algo"),
          transmission_sig: headers.get("paypal-transmission-sig"),
          webhook_id: webhookId,
          webhook_event: JSON.parse(body),
        }),
      }
    );

    const verifyData = await verifyResponse.json();
    console.log("Verification response:", verifyData);
    return verifyData.verification_status === "SUCCESS";
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

serve(async (req) => {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    console.log("Received PayPal webhook:", event.event_type);
    console.log("Resource ID:", event.resource?.id);

    // Verify webhook signature
    if (!PAYPAL_WEBHOOK_ID || !PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error("Missing PayPal configuration");
      return new Response("Configuration error", { status: 500 });
    }

    const isValid = await verifyWebhookSignature(
      PAYPAL_WEBHOOK_ID,
      req.headers,
      body
    );

    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    console.log("✓ Signature verified");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle payment capture completed
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const capture = event.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id || capture.id;

      console.log("Processing completed payment, order ID:", orderId);

      // Update order status to completed
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: "completed",
          updated_at: new Date().toISOString()
        })
        .eq("transaction_id", orderId);

      if (error) {
        console.error("Error updating order:", error);
        throw error;
      }

      console.log("✓ Order updated to completed");
    } else if (event.event_type === "PAYMENT.CAPTURE.DENIED" || 
               event.event_type === "PAYMENT.CAPTURE.REFUNDED") {
      const capture = event.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id || capture.id;
      
      console.log("Payment failed/refunded:", orderId);

      const { error } = await supabase
        .from("orders")
        .update({ 
          status: "failed",
          updated_at: new Date().toISOString()
        })
        .eq("transaction_id", orderId);

      if (error) {
        console.error("Error updating order:", error);
      }
    } else if (event.event_type === "CHECKOUT.ORDER.APPROVED") {
      console.log("Order approved (pending capture):", event.resource?.id);
      // Order is approved but not yet captured - stays pending
    }
// Handle subscription events
    else if (event.event_type === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const subscription = event.resource;
      const subscriptionId = subscription.id;
      
      console.log("Subscription activated:", subscriptionId);

      // Find user by subscription ID
      const { data: profile, error: findError } = await supabase
        .from("profiles")
        .select("id, subscription_tier")
        .eq("paypal_subscription_id", subscriptionId)
        .single();

      if (findError || !profile) {
        console.error("Could not find profile for subscription:", subscriptionId);
        return new Response(JSON.stringify({ received: true }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Subscription is already activated during checkout, just log
      console.log("✓ Subscription already active for user:", profile.id);
    } 
    else if (event.event_type === "BILLING.SUBSCRIPTION.CANCELLED" || 
             event.event_type === "BILLING.SUBSCRIPTION.SUSPENDED" ||
             event.event_type === "BILLING.SUBSCRIPTION.EXPIRED") {
      const subscription = event.resource;
      const subscriptionId = subscription.id;
      
      console.log("Subscription cancelled/suspended/expired:", subscriptionId);

      const { error } = await supabase
        .from("profiles")
        .update({ 
          subscription_tier: "tier_zero",
          updated_at: new Date().toISOString()
        })
        .eq("paypal_subscription_id", subscriptionId);

      if (error) {
        console.error("Error updating subscription tier:", error);
        throw error;
      }

      console.log("✓ Subscription tier reset to tier_zero");
    }
    else if (event.event_type === "PAYMENT.SALE.COMPLETED") {
      // Recurring payment completed
      const sale = event.resource;
      const subscriptionId = sale.billing_agreement_id;
      
      console.log("Recurring payment completed for subscription:", subscriptionId);
      
      // Subscription stays active - no action needed
      console.log("✓ Recurring payment processed");
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
