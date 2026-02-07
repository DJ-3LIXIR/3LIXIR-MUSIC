import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const COINBASE_API_KEY = Deno.env.get("COINBASE_COMMERCE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, description, metadata, userId, userEmail, items } =
      await req.json();

    console.log("Creating Coinbase charge:", { amount, description, userId });

    // Get origin from request or use default
    const origin = req.headers.get("origin") || "https://your-domain.com";

    // Create charge with Coinbase Commerce API
    const response = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": COINBASE_API_KEY!,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify({
        name: description,
        description: description,
        pricing_type: "fixed_price",
        local_price: {
          amount: amount.toFixed(2),
          currency: "USD",
        },
        metadata: {
          userId,
          userEmail,
          items: JSON.stringify(items),
          ...metadata,
        },
        redirect_url: `${origin}/shop?payment=success`,
        cancel_url: `${origin}/shop?payment=cancelled`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Coinbase error:", data);
      throw new Error(data.error?.message || "Failed to create charge");
    }

    console.log("Charge created successfully:", data.data.code);

    return new Response(
      JSON.stringify({
        chargeId: data.data.id,
        code: data.data.code,
        hostedUrl: data.data.hosted_url,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Error creating Coinbase charge:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
