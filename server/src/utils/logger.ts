/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import winston, { Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log directory
const logDir = path.join(__dirname, "../logs");

// Ensure log directory exists
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (error) {
  if (error instanceof Error) {
    console.error(`❌ Failed to create log directory: ${error.message}`);
  }
}

// Console format (for local/dev)
const consoleFormat = winston.format.printf(
  ({ timestamp, level, message, stack, moduleName, ...meta }): string => {
    const prefix = moduleName ? `[${moduleName}] ` : "";
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `[${timestamp}] ${level}: ${prefix}${message}${stack ? `\nStack: ${stack}` : ""
      } ${metaString}`;
  }
);

// Create logger
const logger: Logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json() // Used for file logs
  ),
  defaultMeta: { service: "app-service" },
  transports: [
    // Logs: info+
    new DailyRotateFile({
      filename: path.join(logDir, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info"
    }),

    // Logs: errors only
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "error"
    })
  ]
});

// Add console transport only in non-production
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        consoleFormat
      )
    })
  );
}

// ✅ Utility: Create child logger with module context
export const createModuleLogger = (moduleName: string): Logger =>
  logger.child({ moduleName });

// ✅ Error event handling
logger.on("error", (err: Error): void => {
  console.error("❌ Logger failed:", err.message);
});

// ✅ Init log (optional)
logger.info("✅ Logger initialized", { moduleName: "Logger" });

export default logger;
