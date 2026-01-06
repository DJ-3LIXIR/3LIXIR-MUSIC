import { useState, useEffect } from "react";
import { supabase, Profile } from "../supabaseClient";

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    try {
      // Check if current user is admin
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Please log in first");
        setLoading(false);
        return;
      }

      // Get current user's profile
      const { data: currentProfile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (!currentProfile?.is_admin) {
        setMessage("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      // Load all profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProfiles(data || []);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>{message || "You do not have permission to view this page."}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "20px" }}>
      <h2>Admin Dashboard - All Users</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px", color: "#666" }}>
        <strong>Total Users:</strong> {profiles.length}
        {searchTerm && ` | Showing: ${filteredProfiles.length}`}
      </div>

      {message && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Email
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Full Name
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Bio
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Admin
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  {searchTerm
                    ? "No users found matching your search"
                    : "No users yet"}
                </td>
              </tr>
            ) : (
              filteredProfiles.map((profile) => (
                <tr
                  key={profile.id}
                  style={{ borderBottom: "1px solid #dee2e6" }}
                >
                  <td style={{ padding: "12px" }}>{profile.email}</td>
                  <td style={{ padding: "12px" }}>
                    {profile.full_name || "-"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {profile.bio || "-"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: profile.is_admin
                          ? "#d4edda"
                          : "#f8f9fa",
                        color: profile.is_admin ? "#155724" : "#666",
                        fontSize: "12px",
                      }}
                    >
                      {profile.is_admin ? "Yes" : "No"}
                    </span>
                  </td>
                  <td
                    style={{ padding: "12px", fontSize: "14px", color: "#666" }}
                  >
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Admin Tools</h3>
        <p style={{ color: "#666", fontSize: "14px" }}>
          To make a user an admin, go to your Supabase SQL Editor and run:
        </p>
        <code
          style={{
            display: "block",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
            marginTop: "10px",
          }}
        >
          UPDATE profiles SET is_admin = true WHERE email = 'user@example.com';
        </code>
      </div>
    </div>
  );
}
