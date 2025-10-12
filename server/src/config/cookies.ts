import _config from ".";

const isProduction = process.env.NODE_ENV === "production";

// Access Token Cookie Config
export const accessTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    maxAge: Number(_config.ENV.ACCESS_Token_Expiry) * 1000, // 15 minutes
    path: "/", // ensure it’s available on all routes
};

// Refresh Token Cookie Config
export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    maxAge: Number(_config.ENV.REFRESH_Token_Expiry) * 1000, // 7 days
    path: "/",
};
