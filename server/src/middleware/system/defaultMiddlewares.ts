// src/middlewares/system/defaultMiddlewares.ts

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import winston from "winston";
import expressWinston from "express-winston";
import logger from "@/utils/logger";
import { createRateLimiter } from "@/utils/rateLimiter";


// Express request logger
export const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: "HTTP {{req.method}} {{req.url}}",
  colorize: true,
});

// ----------------------
// Security & Parsing Middlewares
// ----------------------
export const defaultMiddlewares = (app: express.Application) => {
  // Security headers
  app.use(helmet());

  // Enable CORS
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Cookie parsing
  app.use(cookieParser());

  // Gzip compression
  app.use(compression());

  // Rate limiter (global, e.g., per IP)
  app.use(
    createRateLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 500, // max requests per IP
      message: "Too many requests. Try again in 1 hour.",
      keyGenerator: (req: Request) => "ip:" + "unknown", // per IP,
    })
  );

  // Request logging
  app.use(requestLogger);
};
