import { Navbar } from "@/components/layout/Navbar";

export default function Artists() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <h1 className="text-5xl font-display font-bold tracking-tighter mb-8">
          Artists
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover talented producers and artists
        </p>
      </div>
    </div>
  );
}
