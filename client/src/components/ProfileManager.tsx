import { useState, useEffect } from "react";
import { supabase, Profile } from "../supabaseClient";
import { Navbar } from "@/components/layout/Navbar";
import CustomerSupport from "@/pages/CustomerSupport";
import ManageSubscription, {
  Subscription as SubscriptionType,
} from "@/components/Profile/ManageSubscription";
import {
  User,
  Lock,
  ShoppingBag,
  Settings,
  LogOut,
  Camera,
  Download,
  Crown,
  MessageSquare, // ← Add this if not already there
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type Section =
  | "personal"
  | "security"
  | "purchases"
  | "subscription"
  | "settings"
  | "support";

interface Order {
  id: string;
  paypal_order_id: string;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  order_date: string;
  created_at: string;
}

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("settings");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileColor, setProfileColor] = useState("#f59e0b");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionType | null>(
    null,
  );
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [, setLocation] = useLocation();

  const colorOptions = [
    {
      name: "Gold",
      value: "#f59e0b",
      gradient: "from-yellow-500 to-orange-600",
    },
    { name: "Blue", value: "#3b82f6", gradient: "from-blue-500 to-cyan-600" },
    {
      name: "Purple",
      value: "#a855f7",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      name: "Green",
      value: "#10b981",
      gradient: "from-green-500 to-emerald-600",
    },
    { name: "Red", value: "#ef4444", gradient: "from-red-500 to-rose-600" },
    {
      name: "Pink",
      value: "#ec4899",
      gradient: "from-pink-500 to-fuchsia-600",
    },
    {
      name: "Indigo",
      value: "#6366f1",
      gradient: "from-indigo-500 to-purple-600",
    },
    { name: "Teal", value: "#14b8a6", gradient: "from-teal-500 to-cyan-600" },
  ];

  useEffect(() => {
    loadProfile();

    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    if (
      section &&
      [
        "personal",
        "security",
        "purchases",
        "subscription",
        "settings",
        "support", // ← ADD THIS LINE
      ].includes(section)
    ) {
      setActiveSection(section as Section);
    }
  }, []);

  // Add this new useEffect to handle Stripe payment success
  useEffect(() => {
    const handleStripeSuccess = async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get("payment");
      const sessionId = params.get("session_id"); // Stripe adds this parameter

      if (paymentStatus === "success" && sessionId) {
        setMessage("Processing your payment...");

        try {
          // Retrieve the session details from Stripe
          const response = await fetch(
            "https://tciugratutxxrdtbsxim.supabase.co/functions/v1/retrieve-stripe-session",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaXVncmF0dXR4eHJkdGJzeGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NzYwMDgsImV4cCI6MjA4MzA1MjAwOH0.-yif_fwvYOwE6kG4nkSc1HXyF-cHTlZGWGJ91YXsPuM",
              },
              body: JSON.stringify({ sessionId }),
            },
          );

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          setMessage("Payment successful! Your order has been processed.");

          // Reload orders to show the new purchase
          if (activeSection === "purchases") {
            await loadOrders();
          }

          // Clean up URL
          window.history.replaceState({}, "", "/profile?section=purchases");
        } catch (error: any) {
          console.error("Error processing payment:", error);
          setMessage(`Error processing payment: ${error.message}`);
        }
      }
    };

    handleStripeSuccess();
  }, [activeSection]);
  useEffect(() => {
    if (activeSection === "purchases" && profile) {
      loadOrders();
    }
  }, [activeSection, profile]);

  useEffect(() => {
    if (activeSection === "subscription" && profile) {
      loadSubscription();
    }
  }, [activeSection, profile]);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Please log in first");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFullName(data.full_name || "");
      setBio(data.bio || "");
      setProfileColor(data.profile_color || "#f59e0b");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    if (!profile) return;

    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", profile.id)
        .order("order_date", { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error: any) {
      console.error("Error loading orders:", error);
      setMessage(`Error loading orders: ${error.message}`);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadSubscription = async () => {
    if (!profile) return;

    setLoadingSubscription(true);
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", profile.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        throw error;
      }

      setSubscription(data || null);
    } catch (error: any) {
      console.error("Error loading subscription:", error);
      setMessage(`Error loading subscription: ${error.message}`);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const updateProfile = async () => {
    if (!profile) return;

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio: bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      setMessage("Profile updated successfully!");
      setEditing(false);
      await loadProfile();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!profile || !event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploadingImage(true);
    setMessage("");

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setMessage("Profile picture updated successfully!");
      await loadProfile();
    } catch (error: any) {
      setMessage(`Error uploading image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeProfilePicture = async () => {
    if (!profile) return;

    setUploadingImage(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      setMessage("Profile picture removed successfully!");
      await loadProfile();
    } catch (error: any) {
      setMessage(`Error removing image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const updateProfileColor = async (color: string) => {
    if (!profile) return;

    setProfileColor(color);
    setMessage("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          profile_color: color,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      setMessage("Profile color updated successfully!");
      await loadProfile();
    } catch (error: any) {
      setMessage(`Error updating color: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <p>{message || "Please log in to view your profile"}</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "settings" as Section, label: "Settings", icon: Settings },
    { id: "personal" as Section, label: "Personal info", icon: User },
    { id: "security" as Section, label: "Security", icon: Lock },
    { id: "purchases" as Section, label: "Purchases", icon: ShoppingBag },
    {
      id: "subscription" as Section,
      label: "Manage Subscription",
      icon: Crown,
    },
    {
      id: "support" as Section,
      label: "Customer Support",
      icon: MessageSquare,
    },
  ];

  const getProfileGradient = () => {
    const colorOption = colorOptions.find(
      (c) => c.value === (profile?.profile_color || profileColor),
    );
    return colorOption ? colorOption.gradient : "from-yellow-500 to-orange-600";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeSection === item.id
                          ? "bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))]"
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-left mt-8"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign out</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Header */}
              <div className="text-center mb-12 relative">
                {/* Mobile Navigation */}
                <div className="lg:hidden absolute left-0 top-0">
                  <select
                    value={activeSection}
                    onChange={(e) =>
                      setActiveSection(e.target.value as Section)
                    }
                    className="w-28 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[hsl(var(--gold))] focus:outline-none appearance-none cursor-pointer text-xs"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.4rem center",
                      backgroundSize: "0.75rem",
                      paddingRight: "1.5rem",
                    }}
                  >
                    {menuItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-br ${getProfileGradient()} flex items-center justify-center mx-auto mb-6 overflow-hidden`}
                >
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-display font-bold text-black">
                      {(profile.full_name || profile.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-display font-bold mb-2">
                  {profile.full_name || "User"}
                </h1>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>

              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.includes("error") || message.includes("Error")
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : "bg-green-500/10 text-green-500 border border-green-500/20"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Personal Info Section */}
              {activeSection === "personal" && (
                <div className="border border-white/10 rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-display font-bold">
                      Personal Information
                    </h2>
                    {!editing && (
                      <Button
                        onClick={() => setEditing(true)}
                        className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-6"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Email
                      </label>
                      <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                        {profile.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Full Name
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[hsl(var(--gold))] focus:outline-none text-white"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                          {profile.full_name || "Not set"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Bio
                      </label>
                      {editing ? (
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[hsl(var(--gold))] focus:outline-none text-white resize-none"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg min-h-[100px]">
                          {profile.bio || "No bio yet"}
                        </div>
                      )}
                    </div>

                    {editing && (
                      <div className="flex gap-4 pt-4">
                        <Button
                          onClick={updateProfile}
                          disabled={loading}
                          className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full px-8"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditing(false);
                            setFullName(profile.full_name || "");
                            setBio(profile.bio || "");
                            setMessage("");
                          }}
                          variant="outline"
                          className="border-white/10 hover:bg-white/5 rounded-full px-8"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">
                          Account created
                        </p>
                        <p className="font-medium">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">
                          Last updated
                        </p>
                        <p className="font-medium">
                          {new Date(profile.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === "security" && (
                <div className="border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-display font-bold mb-8">
                    Security
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                      <div>
                        <h3 className="font-medium mb-1">Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Last changed: Never
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-white/10 hover:bg-white/5 rounded-full"
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Purchases Section */}
              {activeSection === "purchases" && (
                <div className="border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-display font-bold mb-8">
                    Your Purchases
                  </h2>

                  {loadingOrders ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No purchases yet</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-lg mb-1">
                                Order #{order.id.slice(0, 8)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.order_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                              {order.status}
                            </span>
                          </div>

                          <div className="space-y-3 mb-4">
                            {order.items.map((item: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-4"
                              >
                                <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center flex-shrink-0">
                                  {item.cover ? (
                                    <img
                                      src={item.cover}
                                      alt={item.title}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  ) : (
                                    <ShoppingBag className="w-6 h-6 text-[hsl(var(--gold))]" />
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <p className="font-medium">{item.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.artist}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    ${(item.price || 0).toFixed(2)}
                                  </p>
                                  {(item.quantity || 1) > 1 && (
                                    <p className="text-sm text-muted-foreground">
                                      Qty: {item.quantity}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">
                                Subtotal
                              </span>
                              <span>${(order.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Tax</span>
                              <span>${(order.tax || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total</span>
                              <span className="text-[hsl(var(--gold))]">
                                ${(order.total || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/10">
                            <Button
                              onClick={() => setLocation("/downloads")}
                              variant="outline"
                              className="w-full border-white/10 hover:bg-white/5 rounded-full"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              View Downloads
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Manage Subscription Section */}
              {activeSection === "subscription" && (
                <div className="border border-white/10 rounded-2xl p-8">
                  <h2 className="text-4xl font-display font-bold mb-2 text-center">
                    Manage Your Subscriptions
                  </h2>
                  <ManageSubscription
                    subscription={subscription}
                    loading={loadingSubscription}
                    onRefresh={loadSubscription}
                    userId={profile.id}
                    userEmail={profile.email || ""}
                  />
                </div>
              )}

              {/* Customer Support Section */}
              {activeSection === "support" && (
                <div className="border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-display font-bold mb-6">
                    Customer Support
                  </h2>
                  <CustomerSupport isAdmin={profile.is_admin} />
                </div>
              )}

              {/* Settings Section */}
              {activeSection === "settings" && (
                <div className="border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-display font-bold mb-8">
                    Settings
                  </h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium mb-1">Profile Picture</h3>
                          <p className="text-sm text-muted-foreground">
                            Upload a profile picture or remove the current one
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          className={`w-20 h-20 rounded-full bg-gradient-to-br ${getProfileGradient()} flex items-center justify-center overflow-hidden flex-shrink-0`}
                        >
                          {profile.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl font-display font-bold text-black">
                              {(profile.full_name || profile.email || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-3 flex-wrap">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                              className="hidden"
                            />
                            <div className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full transition-colors font-medium text-sm">
                              <Camera className="w-4 h-4" />
                              {uploadingImage ? "Uploading..." : "Upload Photo"}
                            </div>
                          </label>

                          {profile.avatar_url && (
                            <Button
                              onClick={removeProfilePicture}
                              disabled={uploadingImage}
                              variant="outline"
                              className="border-white/10 hover:bg-white/5 rounded-full text-sm"
                            >
                              Remove Photo
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                      <h3 className="font-medium mb-4">Profile Color</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => updateProfileColor(color.value)}
                            className={`h-12 rounded-lg bg-gradient-to-br ${color.gradient} transition-all ${
                              profileColor === color.value
                                ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-105"
                                : "hover:scale-105"
                            }`}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
