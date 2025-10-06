import { redisClient } from "@/lib/redis";


import crypto from 'crypto';

export const OTP_EXPIRY = 5 * 60; // 5 minutes in seconds

export const storeRegisterOtp = async (email: string, otpHash: string): Promise<void> => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }

    await redisClient.setex(`otp:${email}`, OTP_EXPIRY, otpHash); // ✅ Correct for ioredis
};

export const getRegisterOtp = async (email: string): Promise<string | null> => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }

    return await redisClient.get(`otp:${email}`);
};


function generateOTP(): string {
    return crypto.randomInt(100000, 1000000).toString();
}