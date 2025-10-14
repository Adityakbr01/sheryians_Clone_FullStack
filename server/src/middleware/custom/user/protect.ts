// middleware/custom/user/protect.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "@/utils/ApiError";
import _config from "@/config";
import { getActiveSession } from "@/utils/redis/tokens";
import logger from "@/utils/logger";

// Extend the Request type to include `user` and `session`
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
        email?: string;
    };
    session?: {
        id: string;
        deviceInfo: string;
    };
}

// Middleware to protect routes (hybrid: JWT tokens + Redis session verification)
export const protect = async (
    req: AuthenticatedRequest,
    _res: Response,
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
        // 4. Verify token (stateless verification)
        const decoded = jwt.verify(token, _config.ENV.JWT_ACCESS_TOKEN_SECRET) as {
            id: string;
            role: string;
            email?: string;
            sid?: string;  // Session ID
        };


        // 5. Verify active session in Redis (stateful verification)
        const activeSession = await getActiveSession(decoded.id);

        console.log("Active Session:", activeSession);


        if (!activeSession) {
            logger.warn(`User ${decoded.id} has valid token but no active session`);
            throw new ApiError(401, "Session expired. Please login again.");
        }

        // 6. Verify session ID if it's in the token
        if (decoded.sid && decoded.sid !== activeSession.sessionId) {
            logger.warn(`Session ID mismatch for user ${decoded.id}: token=${decoded.sid}, redis=${activeSession.sessionId}`);
            throw new ApiError(401, "Invalid session. Please login again.");
        }

        // 7. Attach user and session to request
        req.user = decoded;
        req.session = {
            id: activeSession.sessionId,
            deviceInfo: activeSession.deviceInfo
        }; logger.debug(`User ${decoded.id} authenticated with session ${activeSession.sessionId}`);
        next();
    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }
        throw new ApiError(401, "Invalid or expired token");
    }
};
