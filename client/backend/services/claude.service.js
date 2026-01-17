const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful IT support assistant for TechCorp. Your role is to:

1. Help users with technical issues (password resets, software problems, hardware issues)
2. Search the knowledge base to find solutions to common problems
3. Create support tickets when issues require escalation
4. Provide clear, friendly, and professional support

You have access to the following tools:
- search_knowledge_base: Search for solutions in the company knowledge base
- create_ticket: Create a support ticket for issues that need human attention

Guidelines:
- Always search the knowledge base first before creating a ticket
- Be concise but thorough in your responses
- If you're unsure, create a ticket rather than guessing
- Keep a professional yet friendly tone`;

const TOOLS = [
  {
    name: "search_knowledge_base",
    description:
      "Search the knowledge base for solutions to technical problems. Use this to find answers to common IT issues.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The search query to find relevant knowledge base articles",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "create_ticket",
    description:
      "Create a support ticket for issues that require human intervention or escalation.",
    input_schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Brief title describing the issue",
        },
        description: {
          type: "string",
          description: "Detailed description of the problem",
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high", "urgent"],
          description: "Priority level based on severity and impact",
        },
        category: {
          type: "string",
          enum: ["hardware", "software", "network", "account", "other"],
          description: "Category of the issue",
        },
      },
      required: ["title", "description", "priority", "category"],
    },
  },
];

class ClaudeService {
  /**
   * Send a message to Claude and get a response
   * @param {Array} messages - Conversation history in Anthropic format
   * @param {Function} toolHandler - Callback to handle tool use
   * @returns {Object} Claude's response
   */
  async sendMessage(messages, toolHandler) {
    try {
      let response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: messages,
      });

      // Handle tool use loop
      while (response.stop_reason === "tool_use") {
        const toolUse = response.content.find(
          (block) => block.type === "tool_use",
        );

        if (!toolUse) break;

        // Execute the tool via callback
        const toolResult = await toolHandler(toolUse.name, toolUse.input);

        // Add assistant's tool use and tool result to messages
        messages.push({
          role: "assistant",
          content: response.content,
        });

        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: JSON.stringify(toolResult),
            },
          ],
        });

        // Continue conversation with tool result
        response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          tools: TOOLS,
          messages: messages,
        });
      }

      return response;
    } catch (error) {
      console.error("Claude API Error:", error);
      throw new Error("Failed to get response from Claude");
    }
  }

  /**
   * Format messages for Claude API (convert from DB format)
   * @param {Array} dbMessages - Messages from database
   * @returns {Array} Formatted messages for Claude
   */
  formatMessagesForClaude(dbMessages) {
    return dbMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /**
   * Extract text response from Claude's response
   * @param {Object} response - Claude API response
   * @returns {string} Text content
   */
  extractTextResponse(response) {
    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : "";
  }

  /**
   * Check if response contains tool use
   * @param {Object} response - Claude API response
   * @returns {boolean}
   */
  hasToolUse(response) {
    return response.content.some((block) => block.type === "tool_use");
  }

  /**
   * Get tool use details from response
   * @param {Object} response - Claude API response
   * @returns {Object|null} Tool use details
   */
  getToolUse(response) {
    return response.content.find((block) => block.type === "tool_use") || null;
  }
}

module.exports = new ClaudeService();
