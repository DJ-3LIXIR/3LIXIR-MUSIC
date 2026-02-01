// backend/server.js
require("dotenv").config();
console.log("DEBUG: PORT from .env =", process.env.PORT);
const express = require("express");
const cors = require("cors");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const supabase = require("./config/supabase");
// Import routes
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const ticketRoutes = require("./routes/ticket.routes");
const kbRoutes = require("./routes/kb.routes");
const licenseRoutes = require("./routes/license.routes");
const app = express();
// Middleware - FIXED CORS to allow multiple origins
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5000",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Request logging in development - FIXED SYNTAX
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}
// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Test Supabase connection
    const { error } = await supabase.from("profiles").select("count").limit(1);
    res.json({
      status: error ? "degraded" : "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      database: error ? "disconnected" : "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      database: "error",
      message: error.message,
    });
  }
});
// API root endpoint - MOVED BEFORE STATIC FILES
app.get("/api", (req, res) => {
  res.json({
    message: "IT Support AI API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      chat: "/api/chat",
      tickets: "/api/tickets",
      knowledgeBase: "/api/kb",
      licenses: "/api/licenses",
    },
  });
});
// API Routes - MUST BE BEFORE STATIC FILE SERVING
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/licenses", licenseRoutes);
// Serve frontend static files (for production/deployment) - AFTER API ROUTES
const path = require("path");
app.use(express.static(path.join(__dirname, "../client/dist")));
// Serve frontend for all other routes (must be after API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
// 404 handler (this won't be reached due to catch-all above, but keep for API errors)
app.use(notFound);
// Error handler (must be last)
app.use(errorHandler);
// Start server - CHANGED TO PORT 3001 - FIXED SYNTAX
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`💾 Database: Supabase`);
});
// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});
module.exports = app;
