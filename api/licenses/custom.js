import { supabase } from "../lib/supabase.js";
import { auth } from "../lib/auth.js";

export default async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Authenticate user
    const user = await auth(req);

    if (req.method === "POST") {
      // Create custom license
      const { songName, artistName, orderId } = req.body;

      if (!songName || !artistName) {
        return res.status(400).json({
          success: false,
          error: "Song name and artist name are required",
        });
      }

      const { data: license, error } = await supabase
        .from("custom_licenses")
        .insert([
          {
            user_id: user.id,
            song_name: songName,
            artist_name: artistName,
            order_id: orderId,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating custom license:", error);
        return res.status(500).json({
          success: false,
          error: `Failed to create custom license: ${error.message}`,
        });
      }

      return res.status(201).json({
        success: true,
        data: license,
      });
    }

    if (req.method === "GET") {
      // Get all custom licenses for user
      const { data: licenses, error } = await supabase
        .from("custom_licenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching custom licenses:", error);
        return res.status(500).json({
          success: false,
          error: `Failed to fetch custom licenses: ${error.message}`,
        });
      }

      return res.json({
        success: true,
        data: licenses || [],
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);

    if (
      error.message.includes("authorization") ||
      error.message.includes("token")
    ) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
