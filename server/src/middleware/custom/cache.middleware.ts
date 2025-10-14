import { Request, Response, NextFunction } from 'express';
import { redisClient, isRedisConnected } from '@/lib/redis';
import logger from '@/utils/logger';
import { REDIS_TTL } from '@/utils/redis/keys';

export const cacheRoute = (ttl = REDIS_TTL.SHORT) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!isRedisConnected()) {
            return next();
        }

        const cacheKey = `route:${req.originalUrl || req.url}`;
        logger.debug(`Checking cache for: ${cacheKey}`);

        try {
            const cachedResponse = await redisClient?.get(cacheKey);

            if (cachedResponse) {
                const parsedResponse = JSON.parse(cachedResponse);
                logger.debug(`Cache hit: ${cacheKey}`);

                return res.status(parsedResponse.status)
                    .set(parsedResponse.headers || {})
                    .send(parsedResponse.data);
            }

            logger.debug(`Cache miss: ${cacheKey}`);
            const originalSend = res.send;

            res.send = function (body): Response {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const responseToCache = {
                        status: res.statusCode,
                        headers: {
                            'Content-Type': res.getHeader('Content-Type'),
                        },
                        data: body
                    };

                    redisClient?.setex(
                        cacheKey,
                        ttl,
                        JSON.stringify(responseToCache)
                    )
                        .then(() => logger.debug(`Cached response for: ${cacheKey}`))
                        .catch(err =>
                            logger.error(`Error caching response: ${err instanceof Error ? err.message : String(err)}`)
                        );
                }
                return originalSend.call(this, body);
            };

            next();
        } catch (error) {
            logger.error(`Cache middleware error: ${error instanceof Error ? error.message : String(error)}`);
            next();
        }
    };
};
export const clearRouteCache = async (urls: string[]): Promise<void> => {
    if (!isRedisConnected() || !urls.length) return;

    try {
        const pipeline = redisClient?.pipeline();

        urls.forEach(url => {
            const cacheKey = `route:${url}`;
            pipeline?.del(cacheKey);
            logger.debug(`Clearing route cache for: ${cacheKey}`);
        });

        await pipeline?.exec();
        logger.info(`Cleared cache for ${urls.length} routes`);
    } catch (error) {
        logger.error(`Error clearing route cache: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const clearAllRouteCache = async (): Promise<void> => {
    if (!isRedisConnected()) return;

    try {
        const keys = await redisClient?.keys('route:*');

        if (keys && keys.length) {
            const pipeline = redisClient?.pipeline();
            keys.forEach(key => pipeline?.del(key));
            await pipeline?.exec();
            logger.info(`Cleared all route caches (${keys.length} routes)`);
        }
    } catch (error) {
        logger.error(`Error clearing all route caches: ${error instanceof Error ? error.message : String(error)}`);
    }
};