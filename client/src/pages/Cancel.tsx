import { useEffect } from "react";
import { useLocation } from "wouter";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cancel() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (window.opener) {
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-6">
          Your payment was cancelled. No charges were made.
        </p>
        {!window.opener && (
          <Button
            onClick={() => setLocation("/shop")}
            className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8"
          >
            Return to Shop
          </Button>
        )}
        {window.opener && (
          <p className="text-sm text-muted-foreground">
            This window will close automatically...
          </p>
        )}
      </div>
    </div>
  );
}
