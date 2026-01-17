// frontend/src/App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Background } from "@/components/layout/Background";
import Home from "@/pages/Home";
import Beats from "@/pages/Beats";
import BeatsLanding from "@/pages/BeatsLanding";
import Info from "@/pages/Info";
import Licenses from "@/pages/Licenses";
import Shop from "@/pages/Shop";
import StripeSuccess from "@/pages/stripe-success";
import Downloads from "@/pages/Downloads";
import VIPPage from "@/pages/VIPPage";
import Favorites from "@/pages/Favorites";
import NotFound from "@/pages/not-found";
import ProfileManager from "@/components/ProfileManager";
import AdminDashboard from "@/components/AdminDashboard";
import CustomerSupport from "@/pages/CustomerSupport";

// IT Support Components
import Dashboard from "@/components/Dashboard";
import ChatInterface from "@/components/ChatInterface";
import TicketList from "@/components/TicketList";
import TicketForm from "@/components/TicketForm";
import KnowledgeBase from "@/components/KnowledgeBase";

function Router() {
  return (
    <Switch>
      {/* Existing Routes */}
      <Route path="/" component={Home} />
      <Route path="/info" component={Info} />
      <Route path="/beats" component={BeatsLanding} />
      <Route path="/beats/catalog" component={Beats} />
      <Route path="/licenses" component={Licenses} />
      <Route path="/shop" component={Shop} />
      <Route path="/stripe-success" component={StripeSuccess} />
      <Route path="/downloads" component={Downloads} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/vip" component={VIPPage} />
      <Route path="/profile" component={ProfileManager} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/support" component={CustomerSupport} />

      {/* IT Support Routes - NEW */}
      <Route path="/support/dashboard" component={Dashboard} />
      <Route path="/support/chat" component={ChatInterface} />
      <Route path="/support/chat/:conversationId" component={ChatInterface} />
      <Route path="/support/tickets" component={TicketList} />
      <Route path="/support/tickets/new" component={TicketForm} />
      <Route path="/support/tickets/:ticketId" component={TicketForm} />
      <Route path="/support/kb" component={KnowledgeBase} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <div className="relative min-h-screen">
              <Background />
              <div className="relative z-10">
                <Toaster />
                <Router />
              </div>
            </div>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
