import mongoose from "mongoose";
import _config from "@/config/index";
import logger from "@/utils/logger";


export async function connectDB(): Promise<void> {
  const mongoUri = _config.ENV.MONGO_URI;

  if (!mongoUri) {
    logger.error("❌ MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    logger.info("✅ MongoDB connected successfully.");
  } catch (error) {
    logger.error("❌ MongoDB connection failed.", { error });
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info("🔌 MongoDB disconnected successfully.");
  } catch (error) {
    logger.error("❌ Error disconnecting MongoDB.", { error });
  }
}
