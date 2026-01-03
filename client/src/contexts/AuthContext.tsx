import { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthContextType {
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider
      value={{ showAuthModal, openAuthModal, closeAuthModal }}
    >
      {children}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeAuthModal}
          />
          <div className="relative bg-background border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[hsl(var(--gold))]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">
                Account Required
              </h2>
              <p className="text-muted-foreground">
                Create an account to complete your purchase and access your
                beats instantly.
              </p>
            </div>
            <div className="space-y-3">
              <Button className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-6 text-sm font-bold uppercase tracking-widest">
                Create Account
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5 hover:text-white rounded-full py-6 text-sm font-bold uppercase tracking-widest"
              >
                Sign In
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
              Already have an account? Click "Sign In" above
            </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
