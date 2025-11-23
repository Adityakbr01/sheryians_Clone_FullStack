import { CookieOptions } from "express";
import _config from ".";

const isProduction = process.env.NODE_ENV === "production";

export const accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: Number(_config.ENV.ACCESS_Token_Expiry) * 1000,
    path: "/",
};

export const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: Number(_config.ENV.REFRESH_Token_Expiry) * 1000,
    path: "/",
};
