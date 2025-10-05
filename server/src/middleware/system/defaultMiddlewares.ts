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

  // Rate Limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, try again later.",
  });
  app.use(limiter);
  // Request logging
  app.use(requestLogger);
};
