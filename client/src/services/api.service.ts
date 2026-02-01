// frontend/src/services/api.service.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { supabase } from "@/supabaseClient";

// Smart API URL detection
const getAPIUrl = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production mode (built by Vite), use relative path
  if (import.meta.env.PROD) {
    return "/api";
  }

  // Only use localhost:3001 when actually running locally in dev mode
  return "http://localhost:3001/api";
};

const API_URL = getAPIUrl();

console.log("API URL:", API_URL); // Debug log

// Types
export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface Ticket {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TicketStats {
  total: number;
  open: number;
  "in-progress": number;
  resolved: number;
  closed: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  byCategory: {
    hardware: number;
    software: number;
    network: number;
    account: number;
    other: number;
  };
}

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor - Add Supabase auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Get current Supabase session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - try to refresh session
      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        // Session refresh failed, redirect to home
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

// ==================== CHAT SERVICES ====================
export const chatService = {
  // Send a message and get AI response
  sendMessage: async (
    conversationId: string,
    message: string,
  ): Promise<Message> => {
    const response = await api.post<Message>("/chat/message", {
      conversationId,
      message,
    });
    return response.data;
  },

  // Get all conversations for current user
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>("/chat/conversations");
    console.log("getConversations response:", response.data);

    // Handle case where response might not be an array
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // If it's an object with a data property, return that
    if (response.data && Array.isArray((response.data as any).data)) {
      return (response.data as any).data;
    }

    // Otherwise return empty array
    console.warn("Unexpected conversations response format:", response.data);
    return [];
  },

  // Get a specific conversation with messages
  getConversation: async (conversationId: string): Promise<Conversation> => {
    const response = await api.get<Conversation>(
      `/chat/conversations/${conversationId}`,
    );
    return response.data;
  },

  // Create a new conversation
  createConversation: async (title: string): Promise<Conversation> => {
    const response = await api.post<Conversation>("/chat/conversations", {
      title,
    });
    return response.data;
  },

  // Delete a conversation
  deleteConversation: async (
    conversationId: string,
  ): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/chat/conversations/${conversationId}`,
    );
    return response.data;
  },

  // Get conversation history (messages)
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(
      `/chat/conversations/${conversationId}/messages`,
    );
    return response.data;
  },
};

// ==================== TICKET SERVICES ====================
export const ticketService = {
  // Get all tickets
  getAllTickets: async (
    filters: Record<string, string> = {},
  ): Promise<Ticket[]> => {
    const params = new URLSearchParams(filters);
    const response = await api.get<Ticket[]>(`/tickets?${params}`);
    return response.data;
  },

  // Get tickets for current user
  getMyTickets: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>("/tickets/my-tickets");
    return response.data;
  },

  // Get single ticket by ID
  getTicket: async (ticketId: string): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/tickets/${ticketId}`);
    return response.data;
  },

  // Create new ticket
  createTicket: async (ticketData: Partial<Ticket>): Promise<Ticket> => {
    const response = await api.post<Ticket>("/tickets", ticketData);
    return response.data;
  },

  // Update ticket
  updateTicket: async (
    ticketId: string,
    updates: Partial<Ticket>,
  ): Promise<Ticket> => {
    const response = await api.patch<Ticket>(`/tickets/${ticketId}`, updates);
    return response.data;
  },

  // Delete ticket
  deleteTicket: async (ticketId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/tickets/${ticketId}`,
    );
    return response.data;
  },

  // Add message to ticket
  addTicketMessage: async (
    ticketId: string,
    message: string,
  ): Promise<TicketMessage> => {
    const response = await api.post<TicketMessage>(
      `/tickets/${ticketId}/messages`,
      { message },
    );
    return response.data;
  },

  // Get ticket statistics
  getTicketStats: async (): Promise<TicketStats> => {
    const response = await api.get<{ success: boolean; data: TicketStats }>(
      "/tickets/stats",
    );
    // Unwrap the data from the success wrapper
    return response.data.data;
  },
};

// ==================== KNOWLEDGE BASE SERVICES ====================
export const knowledgeBaseService = {
  // Search knowledge base
  search: async (
    query: string,
    filters: Record<string, string> = {},
  ): Promise<KnowledgeBaseArticle[]> => {
    const response = await api.get<KnowledgeBaseArticle[]>("/kb/search", {
      params: { query, ...filters },
    });
    return response.data;
  },

  // Get all articles
  getAllArticles: async (
    filters: Record<string, string> = {},
  ): Promise<KnowledgeBaseArticle[]> => {
    const params = new URLSearchParams(filters);
    const response = await api.get<KnowledgeBaseArticle[]>(
      `/kb/articles?${params}`,
    );
    return response.data;
  },

  // Get single article
  getArticle: async (articleId: string): Promise<KnowledgeBaseArticle> => {
    const response = await api.get<KnowledgeBaseArticle>(
      `/kb/articles/${articleId}`,
    );
    return response.data;
  },

  // Create new article (admin only)
  createArticle: async (
    articleData: Partial<KnowledgeBaseArticle>,
  ): Promise<KnowledgeBaseArticle> => {
    const response = await api.post<KnowledgeBaseArticle>(
      "/kb/articles",
      articleData,
    );
    return response.data;
  },

  // Update article (admin only)
  updateArticle: async (
    articleId: string,
    updates: Partial<KnowledgeBaseArticle>,
  ): Promise<KnowledgeBaseArticle> => {
    const response = await api.patch<KnowledgeBaseArticle>(
      `/kb/articles/${articleId}`,
      updates,
    );
    return response.data;
  },

  // Delete article (admin only)
  deleteArticle: async (articleId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/kb/articles/${articleId}`,
    );
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>("/kb/categories");
    return response.data;
  },

  // Get articles by category
  getByCategory: async (category: string): Promise<KnowledgeBaseArticle[]> => {
    const response = await api.get<KnowledgeBaseArticle[]>(
      `/kb/categories/${category}`,
    );
    return response.data;
  },
};

// ==================== HEALTH CHECK ====================
export interface HealthCheck {
  status: string;
  timestamp: string;
  environment: string;
  database?: string;
}

export const healthCheck = async (): Promise<HealthCheck> => {
  const response = await axios.get<HealthCheck>(
    `${API_URL.replace("/api", "")}/health`,
  );
  return response.data;
};

// Export the configured axios instance for custom requests
export default api;
