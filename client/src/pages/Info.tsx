import { Navbar } from "@/components/layout/Navbar";

export default function Info() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <h1 className="text-5xl font-display font-bold tracking-tighter mb-8">
          Information
        </h1>
        <p className="text-muted-foreground text-lg">
          Learn more about 3LIXIR and our services
        </p>
      </div>
    </div>
  );
}