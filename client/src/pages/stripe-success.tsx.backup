import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function StripeSuccess() {
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get session ID from URL
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");

        if (!sessionId) {
          setStatus("error");
          return;
        }

        console.log("Payment successful! Session ID:", sessionId);

        // Try to communicate with parent window (if opened as popup)
        if (window.opener && !window.opener.closed) {
          console.log("Sending message to parent window");

          // Send message to parent window
          window.opener.postMessage(
            {
              type: "STRIPE_PAYMENT_SUCCESS",
              sessionId: sessionId,
            },
            window.location.origin,
          );

          // Also set localStorage as backup
          localStorage.setItem("stripe_payment_success", "true");
          localStorage.setItem("stripe_session_id", sessionId);

          setStatus("success");

          // Close popup after 2 seconds
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          // Not a popup, redirect to shop
          console.log("Not a popup, setting localStorage and redirecting");
          localStorage.setItem("stripe_payment_success", "true");
          localStorage.setItem("stripe_session_id", sessionId);

          setStatus("success");

          // Redirect to shop after 1 second
          setTimeout(() => {
            window.location.href = "/shop";
          }, 1000);
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        setStatus("error");
      }
    };

    processPayment();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {status === "processing" && (
          <div>
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-4 border-[hsl(var(--gold))] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Processing Payment...</h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your order
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">
              {window.opener
                ? "This window will close automatically..."
                : "Redirecting you back to the shop..."}
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              Unable to process your payment confirmation
            </p>
            <button
              onClick={() => (window.location.href = "/shop")}
              className="px-6 py-3 bg-[hsl(var(--gold))] text-black rounded-full font-bold hover:bg-[hsl(var(--gold))]/90 transition-colors"
            >
              Return to Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
