import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import VIPLicensesimg from "@/components/vip-page/VIPLicensesimg";

export default function VIPPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <VIPLicensesimg />
      </div>
    </div>
  );
}
