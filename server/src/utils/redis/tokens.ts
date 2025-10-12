import _config from "@/config";
import { redisClient } from "@/lib/redis";

export const storeRefreshToken = async (userId: string, token: string) => {
    if (!redisClient) throw new Error("Redis client not initialized");
    await redisClient.set(`refreshToken:${userId}`, token, "EX", _config.ENV.REFRESH_Token_Expiry);
};

export const getRefreshToken = async (userId: string): Promise<string | null> => {
    if (!redisClient) throw new Error("Redis client not initialized");
    return await redisClient.get(`refreshToken:${userId}`);
};

export const deleteRefreshToken = async (userId: string): Promise<void> => {
    if (!redisClient) throw new Error("Redis client not initialized");
    await redisClient.del(`refreshToken:${userId}`);
};
