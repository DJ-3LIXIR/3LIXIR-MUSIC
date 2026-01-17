// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const supabase = require("./config/supabase");

// Import routes
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const ticketRoutes = require("./routes/ticket.routes");
const kbRoutes = require("./routes/kb.routes");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/kb", kbRoutes);

// Serve frontend static files (for production/deployment)
const path = require("path");
app.use(express.static(path.join(__dirname, "../client/dist")));

// API root endpoint
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
    },
  });
});

// Serve frontend for all other routes (must be after API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// 404 handler (this won't be reached due to catch-all above, but keep for API errors)
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
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
