/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import winston, { Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log directory - configurable via env for flexibility
const logDir = process.env.LOG_DIR || path.join(__dirname, "../logs");

// Ensure log directory exists with better error handling
try {
  console.log(`📁 Attempting to create/use log directory: ${logDir}`);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    console.log(`✅ Log directory created: ${logDir}`);
  } else {
    console.log(`✅ Log directory already exists: ${logDir}`);
  }

  // Test write access to the directory
  const testFilePath = path.join(logDir, '.write-test.tmp');
  fs.writeFileSync(testFilePath, 'test');
  fs.unlinkSync(testFilePath); // Clean up immediately
  console.log(`✅ Write access confirmed for log directory`);

} catch (error) {
  if (error instanceof Error) {
    console.error(`❌ Failed to set up log directory: ${error.message}`);
    console.error(`💡 Tip: Check permissions on ${path.dirname(logDir)} or set LOG_DIR env var to a writable path.`);
    // In production, you might want to fallback to console-only or throw
    process.exit(1); // Exit to prevent silent failures (remove if not desired)
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

// Create logger with enhanced error handling
const logger: Logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json() // Used for file logs
  ),
  defaultMeta: { service: "app-service" },
  transports: []
});

// Function to create and add a transport with error handling
const addTransport = (transport: winston.transport) => {
  transport.on('error', (err: Error) => {
    console.error(`❌ Transport error: ${err.message}`);
    console.error(`💡 Check file permissions or disk space for'unknown'}`);
  });
  logger.add(transport);
};

// Logs: info+
const infoTransport = new DailyRotateFile({
  filename: path.join(logDir, "app-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info"
});
addTransport(infoTransport);

// Logs: errors only
const errorTransport = new DailyRotateFile({
  filename: path.join(logDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  level: "error"
});
addTransport(errorTransport);

// Add console transport only in non-production
if (process.env.NODE_ENV !== "production") {
  const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      consoleFormat
    )
  });
  addTransport(consoleTransport);
}

// ✅ Utility: Create child logger with module context
export const createModuleLogger = (moduleName: string): Logger =>
  logger.child({ moduleName });

// ✅ Error event handling (global)
logger.on("error", (err: Error): void => {
  console.error("❌ Logger failed:", err.message);
});

// ✅ Test log to ensure everything works
try {
  logger.info("✅ Logger initialized and transports ready", { moduleName: "Logger", logDir });
  console.log(`✅ Test log written successfully to: ${path.join(logDir, "app-" + new Date().toISOString().split('T')[0] + ".log")}`);
} catch (testError) {
  if (testError instanceof Error) {
    console.error(`❌ Failed to write test log: ${testError.message}`);
  }
}

export default logger;