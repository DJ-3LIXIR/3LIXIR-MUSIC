//force update
const express = require("express");
const router = express.Router();
const chatService = require("../services/chat.service");
const { authenticateUser } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateUser);

/**
 * POST /api/chat/conversations
 * Create a new conversation
 */
router.post("/conversations", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    const conversation = await chatService.createConversation(
      userId,
      title || "New Conversation",
    );

    // Return conversation directly (not wrapped in data)
    res.json(conversation);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/chat/message
 * Send a message and get Claude's response
 */
router.post("/message", async (req, res, next) => {
  try {
    const { conversationId, message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const result = await chatService.processMessage(
      userId,
      conversationId || null,
      message,
    );

    // Return just the assistant message
    res.json({
      id: result.assistantMessage.id,
      conversation_id: result.conversation.id,
      role: "assistant",
      content: result.assistantMessage.content,
      created_at: result.assistantMessage.created_at,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/chat/conversations
 * Get all conversations for the current user
 */
router.get("/conversations", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    const conversations = await chatService.getUserConversations(userId, limit);

    // Return conversations directly (not wrapped in data)
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/chat/conversations/:id
 * Get a specific conversation with all messages
 */
router.get("/conversations/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;

    const conversation = await chatService.getConversationWithMessages(
      userId,
      conversationId,
    );

    // Return conversation directly (not wrapped in data)
    res.json(conversation);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/chat/conversations/:id
 * Update conversation (e.g., rename)
 */
router.patch("/conversations/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const conversation = await chatService.updateConversationTitle(
      userId,
      conversationId,
      title,
    );

    // Return conversation directly (not wrapped in data)
    res.json(conversation);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/chat/conversations/:id
 * Delete a conversation
 */
router.delete("/conversations/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;

    await chatService.deleteConversation(userId, conversationId);

    res.json({
      message: "Conversation deleted",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
