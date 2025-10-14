import { redisClient } from "@/lib/redis";
import { authKeys } from "@/utils/redis/keys";
import logger from "@/utils/logger";

export const OTP_EXPIRY = 5 * 60; // 5 minutes in seconds

export const storeRegisterOtp = async (email: string, otpHash: string): Promise<void> => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }

    try {
        const key = authKeys.registerOtp(email);
        await redisClient.setex(key, OTP_EXPIRY, otpHash);
        logger.debug(`Stored OTP for email: ${email}`);
    } catch (error) {
        logger.error(`Failed to store OTP: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
};

export const getRegisterOtp = async (email: string): Promise<string | null> => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }

    try {
        const key = authKeys.registerOtp(email);
        return await redisClient.get(key);
    } catch (error) {
        logger.error(`Failed to get OTP: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
};

export const deleteRegisterOtp = async (email: string): Promise<void> => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }

    try {
        const key = authKeys.registerOtp(email);
        await redisClient.del(key);
        logger.debug(`Deleted OTP for email: ${email}`);
    } catch (error) {
        logger.error(`Failed to delete OTP: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
};

export const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};