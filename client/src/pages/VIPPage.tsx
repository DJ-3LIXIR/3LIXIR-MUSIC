import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import VIPLicensesimg from "@/components/vip-page/VIPLicensesimg";
import VIPBounce from "@/components/vip-page/VIPBounce";
import { useAuth } from "@/contexts/AuthContext";

export default function VIPPage() {
  const { userProfile, loading } = useAuth();

  // Check if user has an active VIP subscription
  const hasVIPAccess =
    userProfile?.subscription_tier &&
    userProfile.subscription_tier !== "black" &&
    userProfile.subscription_tier !== "tier_zero";

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-foreground relative">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--gold))] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // If no VIP access, show bounce page
  if (!hasVIPAccess) {
    return <VIPBounce />;
  }

  // Show VIP content
  return (
    <div className="min-h-screen bg-black text-foreground relative">
      {/* Textured Background */}
      <div className="fixed inset-0 z-0">
        {/* Left Side */}
        <div
          className="absolute top-0 left-0 bottom-0 w-1/2"
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
          }}
        />
        {/* Right Side - Mirrored */}
        <div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            backgroundImage: 'url("/black_gold_brick_texture.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
            transform: "scaleX(-1)",
          }}
        />
      </div>
      <div className="relative z-10">
        <Navbar />
        <div className="pt-20">
          <VIPLicensesimg />
        </div>
      </div>
    </div>
  );
}
