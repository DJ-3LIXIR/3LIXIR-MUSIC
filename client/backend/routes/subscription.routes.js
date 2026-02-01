const express = require("express");
const {
  createSubscriptionLicense,
  getUserSubscriptions,
} = require("../services/subscription.service");
const { authenticateUser } = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/subscriptions/custom
 * Create a new subscription license
 */
router.post("/custom", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { artistName, tier, orderId } = req.body;

    if (!artistName) {
      return res.status(400).json({
        success: false,
        error: "Artist name is required",
      });
    }

    // Create the subscription with artistName as 'name'
    // Tier info will be stored in the cart/order metadata
    const subscription = await createSubscriptionLicense(userId, {
      name: artistName,
      orderId,
    });

    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Error creating subscription license:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create subscription",
    });
  }
});

/**
 * GET /api/subscriptions/user
 * Get all subscriptions for the authenticated user
 */
router.get("/user", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await getUserSubscriptions(userId);

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch subscriptions",
    });
  }
});

module.exports = router;
