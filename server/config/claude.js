import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

// Initialize Claude client
export const anthropic = new Anthropic({
  apiKey: apiKey,
});

// Model configuration
export const CLAUDE_CONFIG = {
  model: 'claude-sonnet-4-20250514', // Latest Sonnet 4.5
  maxTokens: 4096,
  temperature: 1.0,
};

// System prompts for different contexts
export const SYSTEM_PROMPTS = {
  customerSupport: `You are a helpful and friendly customer support AI assistant. Your role is to:

1. Help customers with their questions and issues promptly and professionally
2. Search the knowledge base when relevant to provide accurate information
3. Create support tickets for complex issues that require human attention
4. Maintain a warm, empathetic tone while being efficient
5. Escalate urgent issues immediately
6. Always confirm you've understood the customer's issue before providing solutions

Guidelines:
- Be concise but thorough
- Use simple, clear language
- Show empathy for customer frustrations
- Offer step-by-step guidance when appropriate
- If you're unsure, say so and offer to create a ticket for human review
- Never make promises about refunds or account changes without human approval

When a customer asks about:
- Account issues → Search knowledge base first, then offer to create ticket
- Billing questions → Always create a ticket for human review
- Technical problems → Troubleshoot step-by-step, create ticket if unresolved
- General questions → Answer directly or search knowledge base`,

  ticketSummary: `You are analyzing a support conversation to create a concise ticket summary. Extract:

1. Main issue or request
2. Key details and context
3. Steps already taken
4. Customer's desired outcome

Keep the summary clear, factual, and actionable for support agents.`,
};

// Tool definitions for Claude
export const TOOLS = [
  {
    name: 'search_knowledge_base',
    description: 'Search the knowledge base for articles and FAQs that might help answer the customer\'s question. Use this when the customer asks about common topics, procedures, or how-to questions.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query to find relevant knowledge base articles',
        },
        category: {
          type: 'string',
          description: 'Optional category to filter results (general, technical, billing, account)',
          enum: ['general', 'technical', 'billing', 'account', 'other'],
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'create_support_ticket',
    description: 'Create a support ticket for issues that require human attention. Use this when: the issue is complex, involves billing/refunds, requires account changes, or you cannot resolve it through chat.',
    input_schema: {
      type: 'object',
      properties: {
        subject: {
          type: 'string',
          description: 'Brief summary of the issue',
        },
        description: {
          type: 'string',
          description: 'Detailed description of the issue and any troubleshooting steps already taken',
        },
        priority: {
          type: 'string',
          description: 'Priority level based on urgency and impact',
          enum: ['low', 'medium', 'high', 'urgent'],
        },
        category: {
          type: 'string',
          description: 'Category of the issue',
          enum: ['general', 'technical', 'billing', 'account', 'other'],
        },
      },
      required: ['subject', 'description', 'priority', 'category'],
    },
  },
  {
    name: 'escalate_to_agent',
    description: 'Immediately escalate the conversation to a human support agent. Use this for: urgent issues, angry customers, requests for human support, or sensitive matters.',
    input_schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Why this conversation needs human attention',
        },
        urgency: {
          type: 'string',
          description: 'How quickly a human should respond',
          enum: ['normal', 'high', 'urgent'],
        },
      },
      required: ['reason', 'urgency'],
    },
  },
];

// Helper function to format conversation history for Claude
export const formatConversationHistory = (messages) => {
  return messages.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content,
  }));
};

// Error messages
export const ERROR_MESSAGES = {
  rateLimit: "I'm currently experiencing high demand. Please try again in a moment.",
  apiError: "I'm having trouble processing your request right now. Let me create a support ticket for you.",
  timeout: "The request is taking longer than expected. Would you like me to create a ticket for follow-up?",
  invalidRequest: "I didn't quite understand that. Could you rephrase your question?",
};