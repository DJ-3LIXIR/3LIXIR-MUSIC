const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);
/**
 * Create a new subscription license record
 */
async function createSubscriptionLicense(userId, data) {
  try {
    const { name, orderId = null } = data;

    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new Error("Valid name is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data: subscription, error } = await supabase
      .from("subscription_licenses")
      .insert([
        {
          user_id: userId,
          name: name.trim(),
          order_id: orderId,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!subscription) {
      throw new Error("No subscription data returned");
    }

    return subscription;
  } catch (error) {
    console.error("Error in createSubscriptionLicense:", error);
    throw error;
  }
}
/**
 * Get subscription by ID
 */
async function getSubscriptionById(subscriptionId) {
  const { data, error } = await supabase
    .from("subscription_licenses")
    .select("*")
    .eq("id", subscriptionId)
    .single();
  if (error) {
    throw new Error(`Failed to get subscription: ${error.message}`);
  }
  return data;
}
/**
 * Get all subscriptions for a user
 */
async function getUserSubscriptions(userId) {
  const { data, error } = await supabase
    .from("subscription_licenses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(`Failed to get user subscriptions: ${error.message}`);
  }
  return data;
}
/**
 * Update subscription status
 */
async function updateSubscriptionStatus(subscriptionId, status) {
  const { data, error } = await supabase
    .from("subscription_licenses")
    .update({ status })
    .eq("id", subscriptionId)
    .select()
    .single();
  if (error) {
    throw new Error(`Failed to update subscription status: ${error.message}`);
  }
  return data;
}
module.exports = {
  createSubscriptionLicense,
  getSubscriptionById,
  getUserSubscriptions,
  updateSubscriptionStatus,
};
