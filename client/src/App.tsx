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
import LicenseDesign from "@/pages/LicenseDesign";
import SubscriptionDesign from "@/pages/SubscriptionDesign";
import LicenseView from "@/pages/LicenseView";
import Shop from "@/pages/Shop";
import StripeSuccess from "@/pages/stripe-success";
import Cancel from "@/pages/Cancel";
import Downloads from "@/pages/Downloads";
import VIPPage from "@/pages/VIPPage";
import Favorites from "@/pages/Favorites";
import Search from "@/pages/Search";
import NotFound from "@/pages/not-found";
import ProfileManager from "@/components/ProfileManager";
import AdminDashboard from "@/components/AdminDashboard";
import Admin from "@/pages/Admin";
import CustomerSupport from "@/pages/CustomerSupport";
import Store from "@/pages/Store";
import VST from "@/pages/VST";
import LoaderPage from "@/pages/3lixirloader";
import ARK from "@/pages/ARK";
import Apollo from "@/pages/APOLLO";
import Hades from "@/pages/HADES";
import Oyster from "@/pages/OYSTER";
import OrionSoundEQ from "@/pages/OrionsoundEQ";

// Contract Pages
import Terms from "@/components/Shop/Contract/Terms";
import BeatLicense from "@/components/Shop/Contract/BeatLicense";
import Privacy from "@/components/Shop/Contract/Privacy";
import Refund from "@/components/Shop/Contract/Refund";
import PurchaseAgreement from "@/components/Shop/Contract/PurchaseAgreement";
import Dmca from "@/components/Shop/Contract/Dmca";

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
      <Route path="/license/design" component={LicenseDesign} />
      <Route path="/subscription/design" component={SubscriptionDesign} />
      <Route path="/license/:type/:id?" component={LicenseView} />
      <Route path="/shop" component={Shop} />
      <Route path="/store" component={Store} />
      <Route path="/vst" component={VST} />
      <Route path="/loader" component={LoaderPage} />
      <Route path="/ark" component={ARK} />
      <Route path="/apollo" component={Apollo} />
      <Route path="/hades" component={Hades} />
      <Route path="/oyster" component={Oyster} />
      <Route path="/orion" component={OrionSoundEQ} />
      <Route path="/stripe-success" component={StripeSuccess} />
      <Route path="/cancel" component={Cancel} />
      <Route path="/downloads" component={Downloads} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/vip" component={VIPPage} />
      <Route path="/profile" component={ProfileManager} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/downloads" component={Admin} />
      <Route path="/support" component={CustomerSupport} />

      {/* Search Route */}
      <Route path="/search" component={Search} />

      {/* Contract/Legal Routes */}
      <Route path="/shop/contract/terms" component={Terms} />
      <Route path="/shop/contract/beat-license" component={BeatLicense} />
      <Route path="/shop/contract/privacy" component={Privacy} />
      <Route path="/shop/contract/refund" component={Refund} />
      <Route
        path="/shop/contract/purchase-agreement"
        component={PurchaseAgreement}
      />
      <Route path="/shop/contract/dmca" component={Dmca} />

      {/* IT Support Routes */}
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