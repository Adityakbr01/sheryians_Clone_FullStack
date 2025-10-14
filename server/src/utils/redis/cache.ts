import { redisClient } from "@/lib/redis";
import logger from "@/utils/logger";
import { REDIS_TTL } from "./keys";

export class RedisCache {
    static async get<T>(key: string): Promise<T | null> {
        try {
            const cachedData = await redisClient?.get(key);
            if (!cachedData) return null;

            return JSON.parse(cachedData) as T;
        } catch (error) {
            logger.error(`Redis cache get error: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        }
    }

    static async set(key: string, data: any, ttl: number = REDIS_TTL.MEDIUM): Promise<void> {
        try {
            const serialized = JSON.stringify(data);
            await redisClient?.setex(key, ttl, serialized);
        } catch (error) {
            logger.error(`Redis cache set error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async del(key: string): Promise<void> {
        try {
            await redisClient?.del(key);
        } catch (error) {
            logger.error(`Redis cache del error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async delByPattern(pattern: string): Promise<void> {
        try {
            const keys = await redisClient?.keys(pattern);

            if (keys && keys.length > 0) {
                const pipeline = redisClient?.pipeline();

                keys.forEach(key => {
                    pipeline?.del(key);
                });

                await pipeline?.exec();
                logger.info(`Cleared ${keys.length} Redis keys matching pattern: ${pattern}`);
            }
        } catch (error) {
            logger.error(`Redis cache pattern delete error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}