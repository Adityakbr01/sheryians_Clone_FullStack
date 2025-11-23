import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,       // true in production
    sameSite: isProduction ? "none" : "lax",  // none for prod, lax for dev
    maxAge: 15 * 60 * 1000,
    path: "/",
};

export const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
};
