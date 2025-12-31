import express from "express";
import cors from "cors";
import { config } from "./config/env.js";

const app = express();

// Middleware
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV
  });
});

// API Routes will be added here
app.use("/api", (_req, res) => {
  res.json({ message: "Snake Tech API is running!" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

export default app;
