// api/subscriptions/custom.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    // Get auth token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Missing or invalid authorization header",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError);
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    const userId = user.id;
    const { artistName, tier, orderId } = req.body;

    // Validate input
    if (!artistName || typeof artistName !== "string" || artistName.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Artist name is required",
      });
    }

    console.log(`Creating subscription for user ${userId}, artist: ${artistName}`);

    // Insert subscription into database
    const { data: subscription, error: dbError } = await supabase
      .from("subscription_licenses")
      .insert([
        {
          user_id: userId,
          name: artistName.trim(),
          order_id: orderId || null,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({
        success: false,
        error: `Database error: ${dbError.message}`,
      });
    }

    if (!subscription) {
      return res.status(500).json({
        success: false,
        error: "No subscription data returned",
      });
    }

    console.log("Subscription created successfully:", subscription.id);

    return res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Error in subscription endpoint:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};
