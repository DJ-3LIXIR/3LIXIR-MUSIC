import { Navbar } from "@/components/layout/Navbar";
import { BeatsGrid } from "@/components/store/BeatsGrid";

export default function Beats() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <BeatsGrid />
      </div>
    </div>
  );
}
