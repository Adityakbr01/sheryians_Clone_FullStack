import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

import _config from "@/config/index";
import { ApiError } from "@/utils/ApiError";
import logger from "@/utils/logger";

interface IErrorResponse {
  statusCode: number;
  message: string;
  stack?: string;
  errors?: Array<{ path: string; message: string }>;
}

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const errorResponse: IErrorResponse = {
    statusCode: 500,
    message: "Internal Server Error"
  };

  // 🧩 Zod validation error
  if (err instanceof ZodError) {
    errorResponse.statusCode = 400;
    errorResponse.message = "Validation failed";
    errorResponse.errors = err.issues.map(issue => ({
      path: issue.path.join("."),
      message: issue.message
    }));
  }

  // 🧩 MongoDB / Mongoose errors
  // Duplicate key error (E11000)
  else if (
    err instanceof mongoose.Error ||
    (typeof err === "object" &&
      err !== null &&
      "code" in err &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any).code === 11000)
  ) {
    console.log(err);
    errorResponse.statusCode = 400;
    errorResponse.message = "Duplicate field value entered";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keyValue = (err as any).keyValue || {};
    errorResponse.errors = Object.keys(keyValue).map(key => ({
      path: key,
      message: `${key} must be unique`
    }));
  }

  // CastError (invalid ObjectId)
  else if (err instanceof mongoose.Error.CastError) {
    errorResponse.statusCode = 400;
    errorResponse.message = "Invalid ID format";
    errorResponse.errors = [
      {
        path: err.path,
        message: `Invalid value '${err.value}' for field '${err.path}'`
      }
    ];
  }

  // ValidationError (Mongoose schema validation)
  else if (err instanceof mongoose.Error.ValidationError) {
    errorResponse.statusCode = 400;
    errorResponse.message = "Validation failed";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorResponse.errors = Object.values(err.errors).map((e: any) => ({
      path: e.path,
      message: e.message
    }));
  }

  // 🧩 Custom API error
  else if (err instanceof ApiError) {
    errorResponse.statusCode = err.statusCode;
    errorResponse.message = err.message;
    if (err.stack) errorResponse.stack = err.stack;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any).errors) errorResponse.errors = (err as any).errors;
  }

  // 🧩 Native Error
  else if (err instanceof Error) {
    errorResponse.message = err.message;
    if (err.stack) errorResponse.stack = err.stack;

    logger.error("Unhandled Error", {
      message: err.message,
      stack: err.stack
    });
  }

  // 🧩 Unknown error
  else {
    logger.error("Unknown error type", { error: err });
  }

  // 📋 Log the request context
  logger.error(
    `[${req.method}] ${req.originalUrl} - ${errorResponse.message}`,
    {
      method: req.method,
      url: req.originalUrl,
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
      ip: req.ip,
      timestamp: new Date().toISOString()
    }
  );

  // 🚀 Final Response
  const responsePayload: {
    success: boolean;
    message: string;
    statusCode: number;
    errors?: IErrorResponse["errors"];
    stack?: string;
  } = {
    success: false,
    message: errorResponse.message,
    statusCode: errorResponse.statusCode
  };

  if (_config.ENV.nodeEnv !== "production" && errorResponse.stack) {
    responsePayload.stack = errorResponse.stack;
  }

  if (errorResponse.errors) {
    responsePayload.errors = errorResponse.errors;
  }

  res.status(errorResponse.statusCode).json(responsePayload);
};

export default globalErrorHandler;
