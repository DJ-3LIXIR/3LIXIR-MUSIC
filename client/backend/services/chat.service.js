const { supabase } = require("../config/supabase");
const claudeService = require("./claude.service");
const knowledgeBaseService = require("./knowledgeBase.service");
const ticketService = require("./ticket.service");

class ChatService {
  /**
   * Process a new message and get Claude's response
   * @param {string} userId - User ID
   * @param {string} conversationId - Conversation ID (optional)
   * @param {string} messageText - User's message
   * @returns {Object} Response with conversation and messages
   */
  async processMessage(userId, conversationId, messageText) {
    try {
      // Get or create conversation
      let conversation;
      if (conversationId) {
        const { data, error } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", conversationId)
          .eq("user_id", userId)
          .single();

        if (error) throw new Error("Conversation not found");
        conversation = data;
      } else {
        conversation = await this.createConversation(userId, messageText);
      }

      // Save user message
      const userMessage = await this.saveMessage(
        conversation.id,
        "user",
        messageText,
      );

      // Get conversation history (EXCLUDING the message we just saved - we'll add it separately)
      const history = await this.getConversationHistory(conversation.id);

      // Filter out the message we just saved to avoid duplication
      const previousHistory = history.filter(
        (msg) => msg.id !== userMessage.id,
      );

      // Format for Claude - this now properly handles metadata
      const claudeMessages = this.formatMessagesForClaude(previousHistory);

      // Add the current user message
      claudeMessages.push({
        role: "user",
        content: messageText,
      });

      // Tool handler for Claude
      const toolHandler = async (toolName, toolInput) => {
        console.log(`Tool called: ${toolName}`, toolInput);

        switch (toolName) {
          case "search_knowledge_base":
            const searchResults = await knowledgeBaseService.search(
              toolInput.query,
            );
            return searchResults;

          case "create_ticket":
            const ticket = await ticketService.createTicket({
              ...toolInput,
              userId,
              conversationId: conversation.id,
            });
            return {
              success: true,
              ticketId: ticket.id,
              ticketNumber: ticket.ticket_number,
              message: `Ticket ${ticket.ticket_number} created successfully`,
            };

          default:
            return { error: "Unknown tool" };
        }
      };

      // Get Claude's response (now returns both response and updated messages array)
      const { response: claudeResponse, messages: updatedMessages } =
        await claudeService.sendMessage(claudeMessages, toolHandler);

      // Save any tool interactions that occurred
      // The updatedMessages array contains all messages including tool_use and tool_result
      const originalLength = claudeMessages.length;
      if (updatedMessages.length > originalLength) {
        // Tool use occurred - save the intermediate messages
        for (let i = originalLength; i < updatedMessages.length - 1; i++) {
          const msg = updatedMessages[i];

          // Extract text content for display
          let displayContent = "";
          if (msg.role === "assistant") {
            displayContent = claudeService.extractTextResponse({
              content: msg.content,
            });
          } else if (msg.role === "user" && Array.isArray(msg.content)) {
            // This is a tool_result message
            displayContent = "Tool result returned";
          }

          await this.saveMessage(conversation.id, msg.role, displayContent, {
            fullContent: msg.content,
            isToolInteraction: true,
          });
        }
      }

      // Extract text response
      const assistantText = claudeService.extractTextResponse(claudeResponse);

      // Save assistant message with full content for context preservation
      const assistantMessage = await this.saveMessage(
        conversation.id,
        "assistant",
        assistantText,
        {
          fullContent: claudeResponse.content,
          stopReason: claudeResponse.stop_reason,
        },
      );

      // Update conversation timestamp
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversation.id);

      return {
        conversation,
        userMessage,
        assistantMessage,
        fullResponse: claudeResponse,
      };
    } catch (error) {
      console.error("Chat Service Error:", error);
      throw error;
    }
  }

  /**
   * Format messages for Claude API
   * Properly handles metadata that contains full Claude responses
   * @param {Array} dbMessages - Messages from database
   * @returns {Array} Formatted messages for Claude
   */
  formatMessagesForClaude(dbMessages) {
    return dbMessages.map((msg) => {
      // If message has metadata with fullContent, use that (preserves tool_use blocks)
      if (msg.metadata && msg.metadata.fullContent) {
        return {
          role: msg.role,
          content: msg.metadata.fullContent,
        };
      }

      // Otherwise just use the text content
      return {
        role: msg.role,
        content: msg.content,
      };
    });
  }

  /**
   * Create a new conversation
   * @param {string} userId - User ID
   * @param {string} firstMessage - First message (for title generation)
   * @returns {Object} Created conversation
   */
  async createConversation(userId, firstMessage) {
    try {
      // Generate a title from first message (simple version)
      const title =
        firstMessage.length > 50
          ? firstMessage.substring(0, 47) + "..."
          : firstMessage;

      const { data: conversation, error } = await supabase
        .from("conversations")
        .insert([
          {
            user_id: userId,
            title,
            last_message_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return conversation;
    } catch (error) {
      console.error("Create Conversation Error:", error);
      throw error;
    }
  }

  /**
   * Save a message to the database
   * @param {string} conversationId - Conversation ID
   * @param {string} role - Message role (user/assistant)
   * @param {string} content - Message content
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Saved message
   */
  async saveMessage(conversationId, role, content, metadata = null) {
    try {
      const { data: message, error } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversationId,
            role,
            content,
            metadata,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return message;
    } catch (error) {
      console.error("Save Message Error:", error);
      throw error;
    }
  }

  /**
   * Get conversation history
   * @param {string} conversationId - Conversation ID
   * @returns {Array} Array of messages
   */
  async getConversationHistory(conversationId) {
    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return messages || [];
    } catch (error) {
      console.error("Get Conversation History Error:", error);
      throw error;
    }
  }

  /**
   * Get all conversations for a user
   * @param {string} userId - User ID
   * @param {number} limit - Number of conversations to return
   * @returns {Array} Array of conversations
   */
  async getUserConversations(userId, limit = 50) {
    try {
      const { data: conversations, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .order("last_message_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return conversations || [];
    } catch (error) {
      console.error("Get User Conversations Error:", error);
      throw error;
    }
  }

  /**
   * Get a single conversation with messages
   * @param {string} userId - User ID
   * @param {string} conversationId - Conversation ID
   * @returns {Object} Conversation with messages
   */
  async getConversationWithMessages(userId, conversationId) {
    try {
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .eq("user_id", userId)
        .single();

      if (convError) throw new Error("Conversation not found");

      const messages = await this.getConversationHistory(conversationId);

      return {
        ...conversation,
        messages,
      };
    } catch (error) {
      console.error("Get Conversation With Messages Error:", error);
      throw error;
    }
  }

  /**
   * Delete a conversation and its messages
   * @param {string} userId - User ID
   * @param {string} conversationId - Conversation ID
   */
  async deleteConversation(userId, conversationId) {
    try {
      // Check if conversation belongs to user
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", userId)
        .single();

      if (convError) throw new Error("Conversation not found");

      // Delete messages first (due to foreign key constraint)
      await supabase
        .from("messages")
        .delete()
        .eq("conversation_id", conversationId);

      // Delete conversation
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;
    } catch (error) {
      console.error("Delete Conversation Error:", error);
      throw error;
    }
  }

  /**
   * Update conversation title
   * @param {string} userId - User ID
   * @param {string} conversationId - Conversation ID
   * @param {string} title - New title
   */
  async updateConversationTitle(userId, conversationId, title) {
    try {
      const { data: conversation, error } = await supabase
        .from("conversations")
        .update({ title })
        .eq("id", conversationId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw new Error("Conversation not found");
      return conversation;
    } catch (error) {
      console.error("Update Conversation Title Error:", error);
      throw error;
    }
  }
}

module.exports = new ChatService();
