// frontend/src/components/ChatInterface.tsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useParams, Link } from "wouter";
import { chatService } from "@/services/api.service";
import type { Conversation, Message } from "@/services/api.service";
import { Send, Plus, MessageSquare, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ChatInterface() {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingConversations(true);
        const data = await chatService.getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
      } finally {
        setLoadingConversations(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user, toast]);

  // Fetch current conversation messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) {
        setCurrentConversation(null);
        setMessages([]);
        return;
      }

      try {
        const conversation = await chatService.getConversation(conversationId);
        setCurrentConversation(conversation);
        setMessages(conversation.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load conversation",
          variant: "destructive",
        });
      }
    };

    fetchMessages();
  }, [conversationId, toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create new conversation
  const handleNewConversation = async () => {
    try {
      const newConv = await chatService.createConversation("New Conversation");
      setConversations([newConv, ...conversations]);
      setLocation(`/support/chat/${newConv.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !conversationId) return;

    const userMessage = inputMessage;
    setInputMessage("");
    setLoading(true);

    try {
      // Add user message to UI immediately
      const tempUserMessage: Message = {
        id: Date.now().toString(),
        conversation_id: conversationId,
        role: "user",
        content: userMessage,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMessage]);

      // Send to backend
      const response = await chatService.sendMessage(
        conversationId,
        userMessage,
      );

      // Replace temp message and add AI response
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMessage.id),
        {
          ...tempUserMessage,
          id: response.id,
        },
        response,
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      // Remove temp message on error
      setMessages((prev) => prev.slice(0, -1));
      setInputMessage(userMessage); // Restore message
    } finally {
      setLoading(false);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await chatService.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        setLocation("/support/chat");
      }
      toast({
        title: "Success",
        description: "Conversation deleted",
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-white/10 bg-black/40 backdrop-blur-sm flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <Link href="/support/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button
            onClick={handleNewConversation}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loadingConversations ? (
            <div className="text-center text-muted-foreground py-8">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a new chat to get help</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                  conversationId === conv.id
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-white/5 hover:bg-white/10 border border-transparent"
                }`}
                onClick={() => setLocation(`/support/chat/${conv.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/10 bg-black/40 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white">
            {currentConversation?.title || "AI Support Chat"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Get instant help from our AI assistant
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!conversationId ? (
            <div className="text-center text-muted-foreground py-16">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">
                Start a conversation
              </h2>
              <p>Select a conversation or create a new one to begin</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No messages yet. Start the conversation below!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[70%] p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-black/40 border-white/10 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </Card>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <Card className="bg-black/40 border-white/10 p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {conversationId && (
          <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-sm">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none text-white placeholder:text-muted-foreground disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
