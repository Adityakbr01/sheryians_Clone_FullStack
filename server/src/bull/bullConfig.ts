import { connectRedis } from "@/lib/redis";

export const redisConnection = connectRedis();

// ✅ BullMQ requires this option to be null
if ((redisConnection.options as any).maxRetriesPerRequest !== null) {
    (redisConnection.options as any).maxRetriesPerRequest = null;
}
