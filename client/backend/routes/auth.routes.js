const { supabase } = require("../config/supabase");

/**
 * Authentication middleware
 * Verifies Supabase JWT token and attaches user to request
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No authentication token provided",
      });
    }

    // Verify Supabase token and get user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: "Invalid authentication token",
      });
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      // If profile doesn't exist, use basic user data
      req.user = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      };
    } else {
      req.user = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      };
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      error: "Authentication error",
    });
  }
};

module.exports = auth;
