// middlewares/validate.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate =
  (schemas: {
    body?: z.ZodObject<any>;
    query?: z.ZodObject<any>;
    params?: z.ZodObject<any>;
  }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        res.locals.validatedBody = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        // Don't overwrite req.query, use res.locals instead
        res.locals.validatedQuery = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        // Don't overwrite req.params, use res.locals instead
        res.locals.validatedParams = await schemas.params.parseAsync(
          req.params
        );
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };


  // todo check this middleware work as well or not