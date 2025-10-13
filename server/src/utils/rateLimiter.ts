import rateLimit, { RateLimitRequestHandler, ipKeyGenerator } from "express-rate-limit";

interface RateLimiterOptions {
    windowMs?: number;           // Time window in ms
    max?: number;                // Max requests in window
    message?: string;            // Response message when limit exceeded
    keyGenerator?: (req: any) => string; // Optional custom key (IP, email, etc.)
}

export const createRateLimiter = ({
    windowMs = 15 * 60 * 1000, // default 15 minutes
    max = 100,                 // default 100 requests
    message = "Too many requests, try again later.",
    keyGenerator,
}: RateLimiterOptions): RateLimitRequestHandler => {
    return rateLimit({
        windowMs,
        max,
        message,
        keyGenerator,
        standardHeaders: true, // send rate limit info in headers
        legacyHeaders: false,  // disable X-RateLimit-* headers
    });
};


//register
export const otpRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,                    // max 5 OTP requests per email
    message: "Too many OTP requests. Try again in 1 hour.",
    keyGenerator: (req) => req.body.email, // per email
});

//Inquiry 
export const inquiryRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1,                    // max 5 enquiry submit
    message: "Too many inquiry submissions. Try again in 1 hour.",
    keyGenerator: (req) => ipKeyGenerator(req), // Using the built-in helper for proper IPv6 handling
});