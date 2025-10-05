/**
 * Middleware: Handles all unhandled errors globally.
 * This should be the last middleware in your Express app.
 */

import _config from "@/config";
import { ApiError } from "@/utils/ApiError";
import logger from "@/utils/logger";
import { Request, Response, NextFunction } from "express"; // <-- Sabse Important Fix yahan hai
import { ZodError } from "zod";

// Ek interface jo alag-alag error objects ke structure ko define karta hai
interface IErrorResponse {
  statusCode: number;
  message: string;
  stack?: string;
}

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Shuru mein ek default error response set karte hain
  let errorResponse: IErrorResponse = {
    statusCode: 500,
    message: "Internal Server Error",
  };

  // 1. Alag-alag Error Types ko Handle Karna
  // ------------------------------------------

  if (err instanceof ZodError) {
    errorResponse.statusCode = 400; // Bad Request
   errorResponse.message = err.issues[0]?.message || "Validation failed";
    logger.error("Zod Validation Error", { issues: err.issues });
  } else if (err instanceof ApiError) {
    errorResponse.statusCode = err.statusCode;
    errorResponse.message = err.message;
    if (err.stack) {
      errorResponse.stack = err.stack;
    }
    logger.error(`API Error [${err.statusCode}]`, { message: err.message });
  } else if (err instanceof Error) {
    errorResponse.message = err.message;
    if (err.stack) {
      errorResponse.stack = err.stack;
    }
    logger.error("Standard Error", {
      message: err.message,
      stack: err.stack,

    });
  } else {
    // Agar koi anjaan error aata hai
    logger.error("Unknown Error Type", { error: err });
  }

  // 2. Request ki Details Log Karna (Debugging ke liye)
  // ----------------------------------------------------
  const errorDetails = {
    method: req.method,
    url: req.originalUrl, // <-- Yeh ab theek se kaam karega
    statusCode: errorResponse.statusCode,
    message: errorResponse.message,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  };

  logger.error(`[${req.method}] ${req.originalUrl} - ${errorResponse.message}`, errorDetails);

  // 3. Final JSON Response User ko Bhejna
  // ----------------------------------------

 const responsePayload: {
  success: boolean;
  message: string;
  statusCode: number; // Type mein add karein
  stack?: string;
} = {
  success: false,
  message: errorResponse.message,
  statusCode: errorResponse.statusCode, // Object mein add karein
};

  // Development environment mein stack trace bhi bhejein taaki debug karna aasan ho
  if (_config.ENV.NODE_ENV !== "production" && errorResponse.stack) {
    responsePayload.stack = errorResponse.stack;
  }

  res.status(errorResponse.statusCode).json(responsePayload); // <-- Yeh ab theek se kaam karega
};

export default globalErrorHandler;