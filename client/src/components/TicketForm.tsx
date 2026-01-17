// frontend/src/components/TicketForm.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useLocation, Link } from "wouter";
import { ticketService } from "@/services/api.service";
import type { Ticket, TicketMessage } from "@/services/api.service";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function TicketForm() {
  const { user } = useAuth();
  const { ticketId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Form state for new ticket
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // State for existing ticket
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch existing ticket if ticketId is provided
  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) return;

      try {
        setLoadingTicket(true);
        const data = await ticketService.getTicket(ticketId);
        setTicket(data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
        toast({
          title: "Error",
          description: "Failed to load ticket",
          variant: "destructive",
        });
        setLocation("/support/tickets");
      } finally {
        setLoadingTicket(false);
      }
    };

    if (user && ticketId) {
      fetchTicket();
    }
  }, [ticketId, user, toast, setLocation]);

  // Handle create new ticket
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const newTicket = await ticketService.createTicket({
        title,
        description,
        priority,
        category,
        status: "open",
      });

      toast({
        title: "Success",
        description: "Ticket created successfully",
      });

      setLocation(`/support/tickets/${newTicket.id}`);
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !ticketId) return;

    try {
      setSendingMessage(true);
      const message = await ticketService.addTicketMessage(
        ticketId,
        newMessage,
      );
      setMessages([...messages, message]);
      setNewMessage("");
      toast({
        title: "Success",
        description: "Message sent",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle update ticket status
  const handleUpdateStatus = async (
    newStatus: "open" | "in_progress" | "resolved" | "closed",
  ) => {
    if (!ticketId) return;

    try {
      const updatedTicket = await ticketService.updateTicket(ticketId, {
        status: newStatus,
      });
      setTicket(updatedTicket);
      toast({
        title: "Success",
        description: "Ticket status updated",
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "in_progress":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "resolved":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "closed":
        return "bg-gray-500/20 text-gray-500 border-gray-500/50";
      default:
        return "bg-white/20 text-white border-white/50";
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-500 border-red-500/50";
      case "high":
        return "bg-orange-500/20 text-orange-500 border-orange-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "low":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      default:
        return "bg-white/20 text-white border-white/50";
    }
  };

  if (loadingTicket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ticket...</p>
        </div>
      </div>
    );
  }

  // Viewing existing ticket
  if (ticketId && ticket) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/support/tickets">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tickets
              </Button>
            </Link>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status.replace("_", " ")}
                  </Badge>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/20 text-muted-foreground"
                  >
                    {ticket.category}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-white">
                  {ticket.title}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Created {new Date(ticket.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Ticket Description */}
          <Card className="bg-black/40 border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Card className="bg-black/40 border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Update Status</CardTitle>
              <CardDescription>Change the ticket status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(["open", "in_progress", "resolved", "closed"] as const).map(
                  (status) => (
                    <Button
                      key={status}
                      variant={ticket.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus(status)}
                      disabled={ticket.status === status}
                      className={
                        ticket.status === status
                          ? "bg-primary"
                          : "border-white/10 hover:bg-white/5"
                      }
                    >
                      {status.replace("_", " ").charAt(0).toUpperCase() +
                        status.slice(1).replace("_", " ")}
                    </Button>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Messages</CardTitle>
              <CardDescription>Communication history</CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No messages yet. Add a message below.
                </p>
              ) : (
                <div className="space-y-4 mb-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <p className="text-white whitespace-pre-wrap">
                        {message.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Message Form */}
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Add a message..."
                  rows={3}
                  disabled={sendingMessage}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none text-white placeholder:text-muted-foreground disabled:opacity-50 resize-none"
                />
                <Button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="bg-primary hover:bg-primary/90 self-end"
                >
                  {sendingMessage ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Creating new ticket
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/support/tickets">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Create New Ticket</h1>
          <p className="text-muted-foreground mt-1">
            Submit a support request and we'll get back to you
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-black/40 border-white/10">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of the issue"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none text-white placeholder:text-muted-foreground"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none text-white"
                >
                  <option value="">Select a category</option>
                  <option value="Account">Account</option>
                  <option value="Network">Network</option>
                  <option value="Software">Software</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["low", "medium", "high", "urgent"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        priority === p
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the issue..."
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none text-white placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href="/support/tickets">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Ticket"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
