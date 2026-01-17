const express = require("express");
const router = express.Router();
const ticketService = require("../services/ticket.service");
const auth = require("../middleware/auth");

// All routes require authentication
router.use(auth);

/**
 * POST /api/tickets
 * Create a new support ticket
 */
router.post("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, category, conversationId } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: "Title and description are required",
      });
    }

    const ticket = await ticketService.createTicket({
      userId,
      title,
      description,
      priority: priority || "medium",
      category: category || "other",
      conversationId,
    });

    res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tickets
 * Get all tickets for the current user
 */
router.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, priority, category } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (category) filters.category = category;

    const tickets = await ticketService.getUserTickets(userId, filters);

    res.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tickets/stats
 * Get ticket statistics for the current user
 */
router.get("/stats", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await ticketService.getTicketStats(userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tickets/search
 * Search tickets
 */
router.get("/search", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const tickets = await ticketService.searchTickets(userId, q);

    res.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tickets/:id
 * Get a specific ticket
 */
router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ticketId = req.params.id;

    const ticket = await ticketService.getTicketById(ticketId, userId);

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/tickets/:id/status
 * Update ticket status
 */
router.patch("/:id/status", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ticketId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["open", "in-progress", "resolved", "closed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Valid status is required (open, in-progress, resolved, closed)",
      });
    }

    const ticket = await ticketService.updateTicketStatus(
      ticketId,
      userId,
      status,
    );

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/tickets/:id/priority
 * Update ticket priority
 */
router.patch("/:id/priority", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ticketId = req.params.id;
    const { priority } = req.body;

    const validPriorities = ["low", "medium", "high", "urgent"];
    if (!priority || !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: "Valid priority is required (low, medium, high, urgent)",
      });
    }

    const ticket = await ticketService.updateTicketPriority(
      ticketId,
      userId,
      priority,
    );

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tickets/:id/notes
 * Add a note to a ticket
 */
router.post("/:id/notes", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ticketId = req.params.id;
    const { note } = req.body;

    if (!note || note.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Note is required",
      });
    }

    const ticket = await ticketService.addTicketNote(ticketId, userId, note);

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/tickets/:id
 * Delete a ticket
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ticketId = req.params.id;

    await ticketService.deleteTicket(ticketId, userId);

    res.json({
      success: true,
      message: "Ticket deleted",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
