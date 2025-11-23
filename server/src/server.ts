import dotenv from "dotenv";
dotenv.config();
import app from "@/app";
import config from "@/config/index";
import logger from "@/utils/logger";

import { connectDB, disconnectDB } from "@/db/db";
import { connectRedis, disconnectRedis } from "@/lib/redis";
import "@/bull";


async function startServer(): Promise<void> {
  try {
    console.log("Server start on this Environment:", process.env.NODE_ENV);
    logger.info("🚀 Starting server...");

    // Connect to MongoDB
    logger.info("📦 Connecting to MongoDB...");
    await connectDB();

    // Connect to Redis
    logger.info("🔴 Connecting to Redis...");
    await connectRedis();

    // Start server
    const server = app.listen(config.ENV.PORT, () => {
      const message = `🚀 Server running on ${config.ENV.HOST}:${config.ENV.PORT}`;
      const docsMessage = `📚 API Docs: http://${config.ENV.HOST}:${config.ENV.PORT}/api-docs`;

      logger.info(message);
      logger.info(docsMessage);
    });

    // Handle server errors
    server.on("error", (error: NodeJS.ErrnoException) => {
      logger.error("❌ Server error", { err: error });
      if (error.code === "EADDRINUSE") {
        logger.error(`❌ Port ${config.ENV.PORT} is already in use`);
      }
      process.exit(1);
    });

    // Graceful shutdown handler
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received, shutting down gracefully...`);

      try {
        // Stop accepting new requests
        await new Promise<void>((resolve, reject) => {
          server.close(err => (err ? reject(err) : resolve()));
        });
        logger.info("✅ HTTP server closed");

        // Disconnect services
        await disconnectDB();
        logger.info("✅ MongoDB disconnected");

        await disconnectRedis();
        logger.info("✅ Redis disconnected");

        process.exit(0);
      } catch (err) {
        logger.error("❌ Error during shutdown", { err });
        process.exit(1);
      }
    };

    // Catch termination signals
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("❌ Failed to start server", { err: error });
    process.exit(1);
  }
}

startServer();
