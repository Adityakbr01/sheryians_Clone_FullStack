import { redisClient } from "@/lib/redis";

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

export const storeRefreshToken = async (userId: string, token: string) => {
    if (!redisClient) throw new Error("Redis client not initialized");

    await redisClient.set(`refreshToken:${userId}`, token, "EX", REFRESH_TOKEN_EXPIRY);
};

export const getRefreshToken = async (userId: string): Promise<string | null> => {
    if (!redisClient) throw new Error("Redis client not initialized");

    return await redisClient.get(`refreshToken:${userId}`);
};

export const deleteRefreshToken = async (userId: string): Promise<void> => {
    if (!redisClient) throw new Error("Redis client not initialized");

    await redisClient.del(`refreshToken:${userId}`);
};
