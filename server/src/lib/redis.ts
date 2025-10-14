import logger from "@/utils/logger";
import Redis from "ioredis";

/**
 * Redis client singleton with enhanced configuration
 */
let redisClient: Redis | null = null;

/**
 * Connect to Redis server with advanced configuration
 * @returns Redis client instance
 */
export const connectRedis = (): Redis => {
    if (!redisClient) {
        if (!process.env.UPSTASH_REDIS_URL) {
            throw new Error("UPSTASH_REDIS_URL is not defined in .env");
        }

        // Create Redis client with optimized configuration
        redisClient = new Redis(process.env.UPSTASH_REDIS_URL, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            reconnectOnError(err) {
                const targetError = "READONLY";
                if (err.message.includes(targetError)) {
                    // Only reconnect when the error includes "READONLY"
                    return true;
                }
                return false;
            },
        });

        // Event handlers
        redisClient.on("connect", () => logger.info("✅ Redis connected"));
        redisClient.on("ready", () => logger.info("✅ Redis ready for commands"));
        redisClient.on("error", (err) => logger.error("❌ Redis connection error", err));
        redisClient.on("reconnecting", () => logger.warn("⚠️ Redis reconnecting..."));
    }

    return redisClient;
};

/**
 * Check if Redis is connected and healthy
 * @returns true if connected, false otherwise
 */
export const isRedisConnected = (): boolean => {
    return redisClient !== null && redisClient.status === 'ready';
};

/**
 * Gracefully disconnect from Redis
 */
export const disconnectRedis = async (): Promise<void> => {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        logger.info("✅ Redis disconnected");
    }
};

/**
 * Flush all cache data (use with caution!)
 */
export const flushCache = async (): Promise<void> => {
    if (redisClient) {
        await redisClient.flushdb();
        logger.warn("⚠️ Redis cache flushed");
    }
};

export { redisClient };
