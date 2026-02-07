// client/src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  subscription_tier: string;
}

interface AuthContextType {
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  user: (User & { subscription_tier?: string }) | null;
  userProfile: UserProfile | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [user, setUser] = useState<
    (User & { subscription_tier?: string }) | null
  >(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Fetch user profile with subscription tier
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setUserProfile(data);
      // Attach subscription_tier to user object for easy access
      if (user) {
        setUser({ ...user, subscription_tier: data.subscription_tier });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = () => {
    setShowAuthModal(true);
    setMessage("");
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setMessage("");
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        // Create profile
        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                email: email,
                full_name: fullName,
                subscription_tier: "tier_zero", // Default tier
              },
            ]);

          if (profileError) throw profileError;
        }

        setMessage("Account created successfully! You can now sign in.");
        setTimeout(() => {
          setIsSignUp(false);
        }, 2000);
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Signed in successfully!");
        setTimeout(() => {
          closeAuthModal();
        }, 1000);
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        showAuthModal,
        openAuthModal,
        closeAuthModal,
        user,
        userProfile,
        signOut,
      }}
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
                {isSignUp ? "Create Account" : "Sign In"}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp
                  ? "Create an account to access all features"
                  : "Welcome back! Sign in to your account."}
              </p>
            </div>

            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  message.includes("error") || message.includes("Error")
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : "bg-green-500/10 text-green-500 border border-green-500/20"
                }`}
              >
                {message}
              </div>
            )}

            <div className="space-y-4 mb-4">
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[hsl(var(--gold))] focus:outline-none text-white placeholder:text-muted-foreground"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[hsl(var(--gold))] focus:outline-none text-white placeholder:text-muted-foreground"
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[hsl(var(--gold))] focus:outline-none text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAuth}
                disabled={loading}
                className="w-full bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full py-6 text-sm font-bold uppercase tracking-widest"
              >
                {loading
                  ? "Loading..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </Button>
              <Button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage("");
                }}
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5 hover:text-white rounded-full py-6 text-sm font-bold uppercase tracking-widest"
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Need an account? Sign Up"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Your data is secured with Supabase authentication
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
