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

// Simple cookie parser middleware (avoids adding external dependency)
app.use((req, _res, next) => {
  const cookieHeader = (req.headers && (req.headers as any).cookie) || '';
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach((c: string) => {
      const [k, ...v] = c.split('=');
      if (!k) return;
      cookies[k.trim()] = decodeURIComponent((v || []).join('=').trim());
    });
  }
  (req as any).cookies = cookies;
  next();
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV
  });
});

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/product/product.routes.js';
import bannerRoutes from './modules/banner/banner.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import feedbackRoutes from './modules/feedback/feedback.routes.js';
import shipperRoutes from './modules/shipper/shipper.routes.js';
import imageRoutes from './modules/image/image.routes.js';
import notificationRoutes from './modules/notification/notification.routes.js';
import rfqRoutes from './modules/rfq/rfq.routes.js';
import wishlistRoutes from './modules/wishlist/wishlist.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/shippers", shipperRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/rfq", rfqRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/admin", adminRoutes);

// Root route for quick check
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Welcome to Snake Tech API" });
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
