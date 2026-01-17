const { supabase } = require("../config/supabase");

class TicketService {
  /**
   * Create a new support ticket
   * @param {Object} ticketData - Ticket data
   * @returns {Object} Created ticket
   */
  async createTicket(ticketData) {
    try {
      const {
        userId,
        title,
        description,
        priority = "medium",
        category = "other",
        conversationId = null,
      } = ticketData;

      // Generate ticket number
      const ticketNumber = await this.generateTicketNumber();

      const { data: ticket, error } = await supabase
        .from("tickets")
        .insert([
          {
            user_id: userId,
            ticket_number: ticketNumber,
            title,
            description,
            priority,
            category,
            status: "open",
            conversation_id: conversationId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return ticket;
    } catch (error) {
      console.error("Create Ticket Error:", error);
      throw new Error("Failed to create ticket");
    }
  }

  /**
   * Generate a unique ticket number
   * @returns {string} Ticket number (e.g., "TICK-001234")
   */
  async generateTicketNumber() {
    try {
      // Get count of all tickets
      const { count, error } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true });

      if (error) throw error;

      const number = String((count || 0) + 1).padStart(6, "0");
      return `TICK-${number}`;
    } catch (error) {
      // Fallback to timestamp-based number if count fails
      const timestamp = Date.now().toString().slice(-6);
      return `TICK-${timestamp}`;
    }
  }

  /**
   * Get all tickets for a user
   * @param {string} userId - User ID
   * @param {Object} filters - Optional filters (status, priority, category)
   * @returns {Array} Array of tickets
   */
  async getUserTickets(userId, filters = {}) {
    try {
      let query = supabase
        .from("tickets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.priority) {
        query = query.eq("priority", filters.priority);
      }
      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Get User Tickets Error:", error);
      throw error;
    }
  }

  /**
   * Get a single ticket by ID
   * @param {string} ticketId - Ticket ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Object} Ticket
   */
  async getTicketById(ticketId, userId) {
    try {
      const { data: ticket, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", ticketId)
        .eq("user_id", userId)
        .single();

      if (error) throw new Error("Ticket not found");
      return ticket;
    } catch (error) {
      console.error("Get Ticket Error:", error);
      throw error;
    }
  }

  /**
   * Update ticket status
   * @param {string} ticketId - Ticket ID
   * @param {string} userId - User ID (for authorization)
   * @param {string} status - New status
   * @returns {Object} Updated ticket
   */
  async updateTicketStatus(ticketId, userId, status) {
    try {
      const updates = { status };

      if (status === "resolved" || status === "closed") {
        updates.resolved_at = new Date().toISOString();
      }

      const { data: ticket, error } = await supabase
        .from("tickets")
        .update(updates)
        .eq("id", ticketId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw new Error("Ticket not found");
      return ticket;
    } catch (error) {
      console.error("Update Ticket Status Error:", error);
      throw error;
    }
  }

  /**
   * Update ticket priority
   * @param {string} ticketId - Ticket ID
   * @param {string} userId - User ID (for authorization)
   * @param {string} priority - New priority
   * @returns {Object} Updated ticket
   */
  async updateTicketPriority(ticketId, userId, priority) {
    try {
      const { data: ticket, error } = await supabase
        .from("tickets")
        .update({ priority })
        .eq("id", ticketId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw new Error("Ticket not found");
      return ticket;
    } catch (error) {
      console.error("Update Ticket Priority Error:", error);
      throw error;
    }
  }

  /**
   * Add a note to a ticket
   * @param {string} ticketId - Ticket ID
   * @param {string} userId - User ID (for authorization)
   * @param {string} note - Note text
   * @returns {Object} Updated ticket
   */
  async addTicketNote(ticketId, userId, note) {
    try {
      // First, get the current ticket
      const { data: ticket, error: fetchError } = await supabase
        .from("tickets")
        .select("notes")
        .eq("id", ticketId)
        .eq("user_id", userId)
        .single();

      if (fetchError) throw new Error("Ticket not found");

      // Append new note
      const currentNotes = ticket.notes || [];
      const updatedNotes = [
        ...currentNotes,
        {
          text: note,
          added_at: new Date().toISOString(),
        },
      ];

      // Update ticket with new notes
      const { data: updatedTicket, error: updateError } = await supabase
        .from("tickets")
        .update({ notes: updatedNotes })
        .eq("id", ticketId)
        .eq("user_id", userId)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedTicket;
    } catch (error) {
      console.error("Add Ticket Note Error:", error);
      throw error;
    }
  }

  /**
   * Get ticket statistics for a user
   * @param {string} userId - User ID
   * @returns {Object} Statistics
   */
  async getTicketStats(userId) {
    try {
      const { data: tickets, error } = await supabase
        .from("tickets")
        .select("status, priority, category")
        .eq("user_id", userId);

      if (error) throw error;

      const stats = {
        total: tickets.length,
        open: 0,
        "in-progress": 0,
        resolved: 0,
        closed: 0,
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0,
        },
        byCategory: {
          hardware: 0,
          software: 0,
          network: 0,
          account: 0,
          other: 0,
        },
      };

      tickets.forEach((ticket) => {
        // Count by status
        if (stats[ticket.status] !== undefined) {
          stats[ticket.status]++;
        }

        // Count by priority
        if (stats.byPriority[ticket.priority] !== undefined) {
          stats.byPriority[ticket.priority]++;
        }

        // Count by category
        if (stats.byCategory[ticket.category] !== undefined) {
          stats.byCategory[ticket.category]++;
        }
      });

      return stats;
    } catch (error) {
      console.error("Get Ticket Stats Error:", error);
      throw error;
    }
  }

  /**
   * Search tickets
   * @param {string} userId - User ID
   * @param {string} searchTerm - Search term
   * @returns {Array} Matching tickets
   */
  async searchTickets(userId, searchTerm) {
    try {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("user_id", userId)
        .or(
          `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,ticket_number.ilike.%${searchTerm}%`,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Search Tickets Error:", error);
      throw error;
    }
  }

  /**
   * Delete a ticket
   * @param {string} ticketId - Ticket ID
   * @param {string} userId - User ID (for authorization)
   */
  async deleteTicket(ticketId, userId) {
    try {
      const { error } = await supabase
        .from("tickets")
        .delete()
        .eq("id", ticketId)
        .eq("user_id", userId);

      if (error) throw new Error("Ticket not found");
    } catch (error) {
      console.error("Delete Ticket Error:", error);
      throw error;
    }
  }
}

module.exports = new TicketService();
