import _config from "@/config";
import { redisClient } from "@/lib/redis";
import { authKeys } from "./keys";
import { RedisCache } from "./cache";
import logger from "@/utils/logger";

// Track active sessions with session ID for single device login
export const storeActiveSession = async (userId: string, sessionId: string, deviceInfo: string, ttl = 60 * 60 * 24 * 7) => {
    if (!redisClient) throw new Error("Redis client not initialized");

    const key = authKeys.activeSession(userId);
    try {
        const sessionData = JSON.stringify({
            sessionId,
            deviceInfo,
            createdAt: new Date().toISOString()
        });

        await redisClient.set(key, sessionData, "EX", ttl); // 7 days by default
        logger.debug(`Stored active session for user ${userId} with sessionId ${sessionId}`);
    } catch (error) {
        logger.error(`Failed to store active session: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
};

export const getActiveSession = async (userId: string): Promise<{ sessionId: string, deviceInfo: string } | null> => {
    if (!redisClient) throw new Error("Redis client not initialized");

    const key = authKeys.activeSession(userId);
    try {
        const sessionData = await redisClient.get(key);
        if (!sessionData) return null;

        return JSON.parse(sessionData);
    } catch (error) {
        logger.error(`Failed to get active session: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
};

export const deleteActiveSession = async (userId: string): Promise<void> => {
    if (!redisClient) throw new Error("Redis client not initialized");

    const key = authKeys.activeSession(userId);
    try {
        await redisClient.del(key);
        logger.debug(`Deleted active session for user ${userId}`);
    } catch (error) {
        logger.error(`Failed to delete active session: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
};

export const storeRefreshToken = async (userId: string, token: string) => {
    if (!redisClient) throw new Error("Redis client not initialized");

    const key = authKeys.refreshToken(userId);
    try {
        await redisClient.set(key, token, "EX", 60 * 60 * 24 * 7); // 7 days in seconds
        logger.debug(`Stored refresh token for user ${userId}`);
    } catch (error) {
        logger.error(`Failed to store refresh token: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
};


export const getRefreshToken = async (userId: string): Promise<string | null> => {
    if (!redisClient) throw new Error("Redis client not initialized");

    const key = authKeys.refreshToken(userId);
    try {
        return await redisClient.get(key);
    } catch (error) {
        logger.error(`Failed to get refresh token: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
};

export const deleteRefreshToken = async (userId: string): Promise<void> => {
    if (!redisClient) throw new Error("Redis client not initialized");

    const key = authKeys.refreshToken(userId);
    try {
        await redisClient.del(key);
        logger.debug(`Deleted refresh token for user ${userId}`);
    } catch (error) {
        logger.error(`Failed to delete refresh token: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
};

export const cacheUserProfile = async (userId: string, profileData: any, ttl = 3600): Promise<void> => {
    const key = authKeys.userProfile(userId);
    await RedisCache.set(key, profileData, ttl);
};

export const getCachedUserProfile = async <T>(userId: string): Promise<T | null> => {
    const key = authKeys.userProfile(userId);
    return await RedisCache.get<T>(key);
};

export const invalidateUserProfile = async (userId: string): Promise<void> => {
    const key = authKeys.userProfile(userId);
    await RedisCache.del(key);
};
