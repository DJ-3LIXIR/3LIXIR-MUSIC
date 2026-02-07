// frontend/src/components/Dashboard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { ticketService, chatService } from "@/services/api.service";
import type { TicketStats } from "@/services/api.service";
import {
  MessageSquare,
  Ticket,
  BookOpen,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
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
  });
  const [conversationCount, setConversationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch ticket stats
        const ticketStats = await ticketService.getTicketStats();
        // Handle both wrapped and unwrapped responses
        const statsData = ticketStats.data || ticketStats;
        setStats(statsData);

        // Fetch conversation count
        const conversations = await chatService.getConversations();
        setConversationCount(conversations.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                IT Support Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.full_name || "User"}
              </p>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="border-white/10 hover:bg-white/5"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/support/chat">
            <Card className="bg-black/40 border-white/10 hover:border-primary/50 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <MessageSquare className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-white">Start New Chat</CardTitle>
                <CardDescription>Get instant AI support</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/support/tickets/new">
            <Card className="bg-black/40 border-white/10 hover:border-primary/50 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Ticket className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-white">Create Ticket</CardTitle>
                <CardDescription>Submit a support request</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/support/kb">
            <Card className="bg-black/40 border-white/10 hover:border-primary/50 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <BookOpen className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-white">Knowledge Base</CardTitle>
                <CardDescription>Browse help articles</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription>Total Tickets</CardDescription>
              <CardTitle className="text-4xl text-white">
                {stats.total}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription>Open Tickets</CardDescription>
              <CardTitle className="text-4xl text-yellow-500">
                {stats.open}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-4xl text-blue-500">
                {stats["in-progress"]}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription>Conversations</CardDescription>
              <CardTitle className="text-4xl text-green-500">
                {conversationCount}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Tickets */}
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">My Tickets</CardTitle>
                <Link href="/support/tickets">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                  >
                    View All
                  </Button>
                </Link>
              </div>
              <CardDescription>Your recent support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/support/tickets">
                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/5"
                >
                  View My Tickets
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Chats */}
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Recent Chats</CardTitle>
                <Link href="/support/chat">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                  >
                    View All
                  </Button>
                </Link>
              </div>
              <CardDescription>Your AI support conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/support/chat">
                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/5"
                >
                  View Conversations
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
