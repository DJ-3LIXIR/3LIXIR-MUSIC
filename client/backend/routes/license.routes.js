const express = require("express");
const router = express.Router();
const licenseService = require("../services/license.service");
const { authenticateUser } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateUser);

/**
 * POST /api/licenses/custom
 * Create a new custom license
 */
router.post("/custom", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { songName, artistName, orderId } = req.body;

    // Get the access token from the request header
    const accessToken = req.header("Authorization")?.replace("Bearer ", "");

    // ADD DETAILED LOGGING
    console.log("=== LICENSE CREATION DEBUG ===");
    console.log("User ID:", userId);
    console.log("User ID type:", typeof userId);
    console.log("Song Name:", songName);
    console.log("Artist Name:", artistName);
    console.log("Order ID:", orderId);
    console.log("Has access token:", !!accessToken);
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("req.user:", JSON.stringify(req.user, null, 2));

    // Validation
    if (!songName || !artistName) {
      return res.status(400).json({
        success: false,
        error: "Song name and artist name are required",
      });
    }

    // ADDITIONAL VALIDATION - Check if userId is a valid UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!userId) {
      console.error("User ID is undefined or null");
      return res.status(400).json({
        success: false,
        error: "User ID is missing",
      });
    }
    if (!uuidRegex.test(userId)) {
      console.error("Invalid user ID format:", userId);
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
    }

    console.log("Calling licenseService.createCustomLicense...");
    const license = await licenseService.createCustomLicense({
      userId,
      songName,
      artistName,
      orderId,
      accessToken, // Pass the access token for RLS
    });

    console.log("License created successfully:", license);
    res.status(201).json({
      success: true,
      data: license,
    });
  } catch (error) {
    console.error("=== LICENSE CREATION ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", error);
    next(error);
  }
});

/**
 * POST /api/licenses/subscription
 * Create a new subscription license
 */
router.post("/subscription", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, orderId, expiresAt } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Name is required",
      });
    }

    const license = await licenseService.createSubscriptionLicense({
      userId,
      name,
      orderId,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      data: license,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/licenses/custom
 * Get all custom licenses for the current user
 */
router.get("/custom", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const licenses = await licenseService.getUserCustomLicenses(userId);

    res.json({
      success: true,
      data: licenses,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/licenses/subscription
 * Get all subscription licenses for the current user
 */
router.get("/subscription", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const licenses = await licenseService.getUserSubscriptionLicenses(userId);

    res.json({
      success: true,
      data: licenses,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/licenses/custom/:id
 * Get a specific custom license
 */
router.get("/custom/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const licenseId = req.params.id;

    const license = await licenseService.getCustomLicenseById(
      licenseId,
      userId,
    );

    res.json({
      success: true,
      data: license,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/licenses/subscription/:id
 * Get a specific subscription license
 */
router.get("/subscription/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const licenseId = req.params.id;

    const license = await licenseService.getSubscriptionLicenseById(
      licenseId,
      userId,
    );

    res.json({
      success: true,
      data: license,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/licenses/order/:orderId
 * Get all licenses for a specific order
 */
router.get("/order/:orderId", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    const licenses = await licenseService.getLicensesByOrderId(orderId, userId);

    res.json({
      success: true,
      data: licenses,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/licenses/custom/:id/status
 * Update custom license status
 */
router.patch("/custom/:id/status", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const licenseId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["pending", "active", "expired", "revoked"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Valid status is required (${validStatuses.join(", ")})`,
      });
    }

    const license = await licenseService.updateCustomLicenseStatus(
      licenseId,
      userId,
      status,
    );

    res.json({
      success: true,
      data: license,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/licenses/subscription/:id/status
 * Update subscription license status
 */
router.patch("/subscription/:id/status", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const licenseId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["active", "expired", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Valid status is required (${validStatuses.join(", ")})`,
      });
    }

    const license = await licenseService.updateSubscriptionLicenseStatus(
      licenseId,
      userId,
      status,
    );

    res.json({
      success: true,
      data: license,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/licenses/custom/:id
 * Delete a custom license
 */
router.delete("/custom/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const licenseId = req.params.id;

    await licenseService.deleteCustomLicense(licenseId, userId);

    res.json({
      success: true,
      message: "Custom license deleted",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/licenses/subscription/:id
 * Delete a subscription license
 */
router.delete("/subscription/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const licenseId = req.params.id;

    await licenseService.deleteSubscriptionLicense(licenseId, userId);

    res.json({
      success: true,
      message: "Subscription license deleted",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
