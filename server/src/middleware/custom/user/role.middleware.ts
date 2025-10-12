import { Request, Response, NextFunction } from "express";

export const roleCheck = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Assuming req.user is set after authentication middleware
            const user = req.user as { role: string } | undefined;

            if (!user) {
                return res.status(401).json({ message: "Unauthorized: No user logged in" });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }

            // Role is allowed, proceed
            next();
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    };
};
