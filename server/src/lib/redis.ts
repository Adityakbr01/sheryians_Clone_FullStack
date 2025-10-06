import logger from "@/utils/logger";
import Redis from "ioredis";

let redisClient: Redis | null = null;

export const connectRedis = (): Redis => {
    if (!redisClient) {
        if (!process.env.UPSTASH_REDIS_URL) {
            throw new Error("UPSTASH_REDIS_URL is not defined in .env");
        }

        redisClient = new Redis(process.env.UPSTASH_REDIS_URL);

        redisClient.on("connect", () => logger.info("✅ Redis connected"));
        redisClient.on("error", (err) => logger.error("❌ Redis connection error", err));
    }

    return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        logger.info("✅ Redis disconnected");
    }
};

export { redisClient };
