// frontend/src/components/TicketList.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { ticketService } from "@/services/api.service";
import type { Ticket } from "@/services/api.service";
import { Plus, ArrowLeft, Filter, Ticket as TicketIcon } from "lucide-react";
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

export default function TicketList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "open" | "in_progress" | "resolved" | "closed"
  >("all");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await ticketService.getMyTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Error",
          description: "Failed to load tickets",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTickets();
    }
  }, [user, toast]);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    return ticket.status === filter;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href="/support/dashboard">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-white">My Tickets</h1>
              <p className="text-muted-foreground mt-1">
                View and manage your support tickets
              </p>
            </div>
            <Link href="/support/tickets/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex space-x-2">
              {(
                ["all", "open", "in_progress", "resolved", "closed"] as const
              ).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className={
                    filter === status
                      ? "bg-primary text-primary-foreground"
                      : "border-white/10 hover:bg-white/5"
                  }
                >
                  {status.replace("_", " ").charAt(0).toUpperCase() +
                    status.slice(1).replace("_", " ")}
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">
                    {status === "all"
                      ? tickets.length
                      : tickets.filter((t) => t.status === status).length}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTickets.length === 0 ? (
          <Card className="bg-black/40 border-white/10">
            <CardContent className="py-16 text-center">
              <TicketIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No tickets found
              </h3>
              <p className="text-muted-foreground mb-6">
                {filter === "all"
                  ? "You haven't created any tickets yet"
                  : `No ${filter.replace("_", " ")} tickets`}
              </p>
              <Link href="/support/tickets/new">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Ticket
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Link key={ticket.id} href={`/support/tickets/${ticket.id}`}>
                <Card className="bg-black/40 border-white/10 hover:border-primary/50 transition-all cursor-pointer group">
                  <CardHeader>
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
                        <CardTitle className="text-white group-hover:text-primary transition-colors">
                          {ticket.title}
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                          {ticket.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Created{" "}
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                      <span>
                        Updated{" "}
                        {new Date(ticket.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
