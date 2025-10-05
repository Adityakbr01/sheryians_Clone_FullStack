// src/middlewares/system/notFound.ts

import { Request, Response, NextFunction } from "express";

// ----------------------
// 404 Middleware
// ----------------------
interface NotFoundResponse {
  success: boolean;
  message: string;
  data: any[];
}

const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const response: NotFoundResponse = {
    success: false,
    message: "API route not found",
    data: [],
  };

  res.status(404).json(response);
};

export default notFoundHandler;
