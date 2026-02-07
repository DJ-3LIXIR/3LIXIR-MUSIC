/**
 * Global error handler middleware
 * Catches all errors and formats them consistently
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Authentication error",
    });
  }

  // Supabase errors
  if (err.code) {
    // Duplicate key error
    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        error: "Resource already exists",
      });
    }

    // Foreign key constraint error
    if (err.code === "23503") {
      return res.status(400).json({
        success: false,
        error: "Related resource not found",
      });
    }

    // Not null violation
    if (err.code === "23502") {
      return res.status(400).json({
        success: false,
        error: "Required field is missing",
      });
    }
  }

  // Custom application errors
  if (err.message) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};

/**
 * 404 handler for undefined routes
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
};

module.exports = { errorHandler, notFound };
