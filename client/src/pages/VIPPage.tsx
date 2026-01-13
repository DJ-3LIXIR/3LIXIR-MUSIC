import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import VIPLicensesimg from "@/components/vip-page/VIPLicensesimg";

export default function VIPPage() {
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
