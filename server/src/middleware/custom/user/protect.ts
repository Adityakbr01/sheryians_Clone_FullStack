// middleware/custom/user/protect.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "@/utils/ApiError";
import _config from "@/config";

// Extend the Request type to include `user`
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

// Middleware to protect routes (hybrid: cookie + header)
export const protect = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    let token: string | undefined;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    // 2. Else check access token cookie
    if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    // 3. No token found
    if (!token) {
        throw new ApiError(401, "Unauthorized. No token provided.");
    }

    try {
        // 4. Verify token
        const decoded = jwt.verify(token,_config.ENV.JWT_SECRET) as {
            id: string;
            role: string;
        };

        // 5. Attach user to request
        req.user = decoded;

        next();
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token");
    }
};
