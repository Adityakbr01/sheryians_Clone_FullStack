import Enquiry from "@/models/inquery.model";
import { FilterParams, IEnquiry } from "@/types/models/courses/enquiry";
import { ApiError } from "@/utils/ApiError";
import { RedisCache } from "@/utils/redis/cache";
import { REDIS_TTL, enquiryKeys } from "@/utils/redis/keys";
import logger from "@/utils/logger";
import crypto from "crypto";

/**
 * Enquiry service with Redis caching for improved performance
 */
const enquiriesService = {
    /**
     * Create a new enquiry with rate limiting
     * @param data Enquiry data
     * @returns Created enquiry
     */
    createEnquiry: async (data: Partial<IEnquiry>) => {
        if (!data.phone) throw new Error("Phone is required");

        // 🚫 Check if the same phone submitted recently
        const cooldownMinutes = 10;
        const cooldownTime = new Date(Date.now() - cooldownMinutes * 60 * 1000);

        const recentEnquiry = await Enquiry.findOne({
            phone: data.phone,
            createdAt: { $gte: cooldownTime },
            isDeleted: false,
        });

        if (recentEnquiry) {
            throw new ApiError(400,
                `Too many requests. Please wait ${cooldownMinutes} minutes before submitting again.`
            );
        }

        // ✅ If no recent enquiry, create a new one
        const enquiry = new Enquiry(data);
        const savedEnquiry = await enquiry.save();

        // Invalidate all enquiry list caches since we've added a new enquiry
        await RedisCache.delByPattern(enquiryKeys.listPattern());

        return savedEnquiry;
    },

    /**
     * Get all enquiries with Redis caching
     * @param includeDeleted Whether to include soft-deleted enquiries
     * @returns Array of enquiries
     */
    getAllEnquiries: async (includeDeleted = false) => {
        // Try to get from cache first
        const cacheKey = enquiryKeys.list(includeDeleted);
        const cachedEnquiries = await RedisCache.get(cacheKey);

        if (cachedEnquiries) {
            logger.debug(`Enquiries list (includeDeleted=${includeDeleted}) retrieved from cache`);
            return cachedEnquiries;
        }

        // Cache miss, get from database
        const filter = includeDeleted ? {} : { isDeleted: false };
        const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });

        // Cache the results for future requests (short TTL since enquiries change frequently)
        await RedisCache.set(cacheKey, enquiries, REDIS_TTL.SHORT);

        return enquiries;
    },

    /**
     * Mark an enquiry as checked and update cache
     * @param id Enquiry ID
     * @returns Updated enquiry
     */
    markEnquiryChecked: async (id: string) => {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(
            id,
            { isChecked: true },
            { new: true }
        );

        if (updatedEnquiry) {
            // Update the individual enquiry cache
            const detailCacheKey = enquiryKeys.detail(id);
            await RedisCache.set(detailCacheKey, updatedEnquiry);

            // Invalidate all list caches since an enquiry status changed
            await RedisCache.delByPattern(enquiryKeys.listPattern());
        }

        return updatedEnquiry;
    },

    /**
     * Soft delete an enquiry and update cache
     * @param id Enquiry ID
     * @returns Updated enquiry
     */
    softDeleteEnquiry: async (id: string) => {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (updatedEnquiry) {
            // Update the individual enquiry cache
            const detailCacheKey = enquiryKeys.detail(id);
            await RedisCache.set(detailCacheKey, updatedEnquiry);

            // Invalidate all list caches since an enquiry was deleted
            await RedisCache.delByPattern(enquiryKeys.listPattern());
        }

        return updatedEnquiry;
    },

    /**
     * Filter enquiries with cache for repeated identical queries
     * @param filters Filter parameters
     * @returns Filtered enquiries
     */
    filterEnquiries: async (filters: FilterParams) => {
        // Create a hash of the filters to use as cache key
        const filterHash = crypto
            .createHash('md5')
            .update(JSON.stringify(filters))
            .digest('hex');

        const cacheKey = enquiryKeys.filtered(filterHash);

        // Try to get from cache first
        const cachedResults = await RedisCache.get(cacheKey);
        if (cachedResults) {
            logger.debug(`Filtered enquiries retrieved from cache: ${filterHash}`);
            return cachedResults;
        }

        // Build query
        const query: any = {};

        if (filters.datetimeFrom || filters.datetimeTo) {
            query.datetime = {};
            if (filters.datetimeFrom) query.datetime.$gte = new Date(filters.datetimeFrom);
            if (filters.datetimeTo) query.datetime.$lte = new Date(filters.datetimeTo);
        }

        if (filters.isChecked !== undefined) query.isChecked = filters.isChecked;
        if (filters.isDeleted !== undefined) query.isDeleted = filters.isDeleted;

        // Execute query
        const results = await Enquiry.find(query).sort({ datetime: -1 });

        // Cache filtered results with short TTL
        await RedisCache.set(cacheKey, results, REDIS_TTL.SHORT);

        return results;
    },

    /**
     * Get a single enquiry by ID with caching
     * @param id Enquiry ID
     * @returns Enquiry or null if not found
     */
    getEnquiryById: async (id: string) => {
        // Try to get from cache first
        const cacheKey = enquiryKeys.detail(id);
        const cachedEnquiry = await RedisCache.get(cacheKey);

        if (cachedEnquiry) {
            logger.debug(`Enquiry ${id} retrieved from cache`);
            return cachedEnquiry;
        }

        // Cache miss, get from database
        const enquiry = await Enquiry.findById(id);

        // Only cache if enquiry exists
        if (enquiry) {
            await RedisCache.set(cacheKey, enquiry, REDIS_TTL.MEDIUM);
        }

        return enquiry;
    },

    /**
     * Clear all enquiry caches
     * Used for administrative purposes or after bulk operations
     */
    clearCache: async () => {
        await RedisCache.delByPattern(enquiryKeys.pattern());
        await RedisCache.delByPattern(enquiryKeys.listPattern());
        logger.info('All enquiry caches cleared');
    }
}

export default enquiriesService;