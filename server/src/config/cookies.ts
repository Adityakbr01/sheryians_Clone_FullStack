import { CookieOptions } from "express";
import _config from ".";

const isProduction = process.env.NODE_ENV === "production";


//todo fix the secure flag before deploying to production

export const accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
};

export const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

};
