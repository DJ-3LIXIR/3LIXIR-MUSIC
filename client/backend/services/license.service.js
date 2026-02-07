const { supabase } = require("../config/supabase");

/**
 * License Service
 * Handles all business logic for custom and subscription licenses
 */
const licenseService = {
  async createCustomLicense(data) {
    const { userId, songName, artistName, orderId } = data;

    if (!userId || !songName || !artistName) {
      throw new Error("User ID, song name, and artist name are required");
    }

    const { data: license, error } = await supabase
      .from("custom_licenses")
      .insert([
        {
          user_id: userId,
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
      throw new Error(`Failed to create custom license: ${error.message}`);
    }

    return license;
  },

  async createSubscriptionLicense(data) {
    const { userId, name, orderId, expiresAt } = data;

    if (!userId || !name) {
      throw new Error("User ID and name are required");
    }

    const { data: license, error } = await supabase
      .from("subscription_licenses")
      .insert([
        {
          user_id: userId,
          name: name,
          order_id: orderId,
          expires_at: expiresAt,
          status: "active",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating subscription license:", error);
      throw new Error(
        `Failed to create subscription license: ${error.message}`,
      );
    }

    return license;
  },

  async getUserCustomLicenses(userId) {
    const { data: licenses, error } = await supabase
      .from("custom_licenses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching custom licenses:", error);
      throw new Error(`Failed to fetch custom licenses: ${error.message}`);
    }

    return licenses || [];
  },

  async getUserSubscriptionLicenses(userId) {
    const { data: licenses, error } = await supabase
      .from("subscription_licenses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscription licenses:", error);
      throw new Error(
        `Failed to fetch subscription licenses: ${error.message}`,
      );
    }

    return licenses || [];
  },

  async getCustomLicenseById(licenseId, userId) {
    const { data: license, error } = await supabase
      .from("custom_licenses")
      .select("*")
      .eq("id", licenseId)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Custom license not found");
      }
      console.error("Error fetching custom license:", error);
      throw new Error(`Failed to fetch custom license: ${error.message}`);
    }

    return license;
  },

  async getSubscriptionLicenseById(licenseId, userId) {
    const { data: license, error } = await supabase
      .from("subscription_licenses")
      .select("*")
      .eq("id", licenseId)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Subscription license not found");
      }
      console.error("Error fetching subscription license:", error);
      throw new Error(`Failed to fetch subscription license: ${error.message}`);
    }

    return license;
  },

  async getLicensesByOrderId(orderId, userId) {
    const { data: customLicenses, error: customError } = await supabase
      .from("custom_licenses")
      .select("*")
      .eq("order_id", orderId)
      .eq("user_id", userId);

    const { data: subscriptionLicenses, error: subscriptionError } =
      await supabase
        .from("subscription_licenses")
        .select("*")
        .eq("order_id", orderId)
        .eq("user_id", userId);

    if (customError || subscriptionError) {
      console.error("Error fetching licenses by order ID:", {
        customError,
        subscriptionError,
      });
      throw new Error("Failed to fetch licenses by order ID");
    }

    return {
      customLicenses: customLicenses || [],
      subscriptionLicenses: subscriptionLicenses || [],
    };
  },

  async updateCustomLicenseStatus(licenseId, userId, status) {
    const validStatuses = ["pending", "active", "expired", "revoked"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    const { data: license, error } = await supabase
      .from("custom_licenses")
      .update({ status })
      .eq("id", licenseId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating custom license status:", error);
      throw new Error(
        `Failed to update custom license status: ${error.message}`,
      );
    }

    return license;
  },

  async updateSubscriptionLicenseStatus(licenseId, userId, status) {
    const validStatuses = ["active", "expired", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    const { data: license, error } = await supabase
      .from("subscription_licenses")
      .update({ status })
      .eq("id", licenseId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating subscription license status:", error);
      throw new Error(
        `Failed to update subscription license status: ${error.message}`,
      );
    }

    return license;
  },

  async deleteCustomLicense(licenseId, userId) {
    const { error } = await supabase
      .from("custom_licenses")
      .delete()
      .eq("id", licenseId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting custom license:", error);
      throw new Error(`Failed to delete custom license: ${error.message}`);
    }
  },

  async deleteSubscriptionLicense(licenseId, userId) {
    const { error } = await supabase
      .from("subscription_licenses")
      .delete()
      .eq("id", licenseId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting subscription license:", error);
      throw new Error(
        `Failed to delete subscription license: ${error.message}`,
      );
    }
  },
};

module.exports = licenseService;
