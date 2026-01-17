import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Ticket,
  MessageSquare,
  X,
  Check,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react";

// Mock API client - replace with actual backend calls
const api = {
  async sendMessage(conversationId, message) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id: Date.now(),
      content: "I understand you need help. Let me look into that for you...",
      role: "assistant",
      timestamp: new Date().toISOString(),
    };
  },
  async createTicket(data) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: `TICK-${Date.now()}`,
      ...data,
      status: "open",
      created_at: new Date().toISOString(),
    };
  },
  async getTickets() {
    return [
      {
        id: "TICK-001",
        subject: "Login issue",
        status: "open",
        priority: "high",
        created_at: new Date().toISOString(),
      },
      {
        id: "TICK-002",
        subject: "Billing question",
        status: "pending",
        priority: "medium",
        created_at: new Date().toISOString(),
      },
    ];
  },
};

// Customer Chat Interface
function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! How can I help you today?",
      role: "assistant",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      content: input,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.sendMessage("conv-123", input);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white/5 border border-white/10 rounded-lg">
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-yellow-600 to-orange-600">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-black">
          <MessageSquare size={20} />
          Customer Support Chat
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-black"
                  : "bg-white/10 text-white border border-white/20"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-white placeholder-gray-400"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-black rounded-lg hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Ticket Creation Form
function TicketForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "general",
  });

  const handleSubmit = async () => {
    if (!formData.subject || !formData.description) return;

    const ticket = await api.createTicket(formData);
    onSubmit(ticket);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Create Support Ticket
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-white"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-white"
            >
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="account">Account</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-black rounded-lg hover:from-yellow-500 hover:to-orange-500 font-medium"
            >
              Create Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ticket List Component
function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    const data = await api.getTickets();
    setTickets(data);
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <Clock size={16} className="text-blue-400" />;
      case "pending":
        return <AlertCircle size={16} className="text-yellow-400" />;
      case "resolved":
        return <Check size={16} className="text-green-400" />;
      default:
        return <Clock size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">Loading tickets...</div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="bg-white/5 border border-white/10 p-4 rounded-lg hover:border-white/20 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(ticket.status)}
                <h3 className="font-semibold text-white">{ticket.subject}</h3>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-mono text-gray-400">{ticket.id}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(ticket.priority)}`}
                >
                  {ticket.priority}
                </span>
                <span className="text-gray-400">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Admin Dashboard
function AdminDashboard() {
  const stats = [
    {
      label: "Open Tickets",
      value: "24",
      icon: Ticket,
      color: "from-yellow-600 to-orange-600",
    },
    {
      label: "Active Chats",
      value: "12",
      icon: MessageSquare,
      color: "from-green-600 to-emerald-600",
    },
    {
      label: "Avg Response Time",
      value: "2.3m",
      icon: Clock,
      color: "from-purple-600 to-pink-600",
    },
    {
      label: "Customer Satisfaction",
      value: "94%",
      icon: Check,
      color: "from-blue-600 to-cyan-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 border border-white/10 p-6 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Recent Tickets
        </h3>
        <TicketList />
      </div>
    </div>
  );
}

// Main Embedded Component
export default function CustomerSupport({ isAdmin = false }) {
  const [activeView, setActiveView] = useState("chat");
  const [showTicketForm, setShowTicketForm] = useState(false);

  const navigation = [
    { id: "chat", label: "Live Chat", icon: MessageSquare },
    { id: "tickets", label: "My Tickets", icon: Ticket },
    ...(isAdmin ? [{ id: "admin", label: "Dashboard", icon: Users }] : []),
  ];

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/10">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeView === item.id
                ? "border-yellow-600 text-yellow-600"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div>
        {activeView === "chat" && <ChatInterface />}

        {activeView === "tickets" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Support Tickets</h2>
              <button
                onClick={() => setShowTicketForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-black rounded-lg hover:from-yellow-500 hover:to-orange-500 flex items-center gap-2 font-medium"
              >
                <Ticket size={18} />
                New Ticket
              </button>
            </div>
            <TicketList />
          </div>
        )}

        {activeView === "admin" && isAdmin && <AdminDashboard />}
      </div>

      {/* Ticket Form Modal */}
      {showTicketForm && (
        <TicketForm
          onClose={() => setShowTicketForm(false)}
          onSubmit={(ticket) => console.log("Ticket created:", ticket)}
        />
      )}
    </div>
  );
}
