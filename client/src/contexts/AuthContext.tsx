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
          // Try to create profile if it doesn't exist (handled by trigger usually)
          // We use upsert to handle cases where trigger might have already created it
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert([
              {
                id: data.user.id,
                email: email,
                full_name: fullName,
                subscription_tier: "tier_zero", // Default tier
              },
            ], { onConflict: 'id' });

          if (profileError) {
            console.warn("Profile creation/update warning:", profileError);
            // Don't throw here, as the trigger might have handled it or it might be an RLS issue
            // that doesn't prevent the user from being created in Auth
          }
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

  // Google OAuth. Redirects away to Google and returns to the page the user
  // started from, so someone stopped at a tool's auth wall lands back on that
  // tool rather than the homepage.
  const handleGoogleAuth = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.href,
        },
      });

      if (error) throw error;
      // On success the browser navigates to Google; nothing after this runs.
    } catch (error: any) {
      setMessage(error.message || "Could not sign in with Google");
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

            {/* Google OAuth — placed above the email form so the low-friction
                path is the first thing a new visitor sees. */}
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              variant="outline"
              className="w-full mb-4 bg-white text-black hover:bg-white/90 border-0 rounded-full py-6 text-sm font-bold"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

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
