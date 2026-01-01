import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { validateEnvironment, config } from "./config/env.js";
import { initializeSocket } from "./config/socket.js";

async function startServer(): Promise<void> {
  try {
    // Validate environment variables
    validateEnvironment();

    // Connect to database
    await connectDatabase();

    // Create HTTP server
    const server = app.listen(config.PORT);

    // Initialize Socket.IO
    initializeSocket(server);

    const serverUrl = `http://localhost:${config.PORT}`;
    const healthUrl = `${serverUrl}/api/health`;

    console.log("\n🚀 ========================================");
    console.log(`✅ Snake Tech Server đang chạy tại: ${serverUrl}`);
    console.log(`🔌 Socket.IO enabled`);
    console.log(`🏥 Health check: ${healthUrl}`);
    console.log(`🌍 Environment: ${config.NODE_ENV}`);
    console.log("🚀 ========================================\n");

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
