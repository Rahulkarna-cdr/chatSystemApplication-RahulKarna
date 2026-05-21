import config from "../config/config.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  // happens when required fields are missing or schema rules are broken
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Mongoose duplicate key error
  // happens when you try to register with an email that already exists
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  // Mongoose invalid ObjectId
  // happens when a malformed id is passed to findById or similar
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  // JWT errors — in case any slip past your auth middleware
  if (err.name === "JsonWebTokenError") {
    return res.status(403).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(403).json({ message: "Token expired" });
  }

  // fallback for anything unhandled
  const statusCode = err.statusCode || err.status || 500;
  const message =
    config.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  return res.status(statusCode).json({ message });
};