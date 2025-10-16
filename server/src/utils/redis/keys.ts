/**
 * Centralized Redis key management
 * Using a pattern-based approach for better organization and easier invalidation
 */

export const REDIS_KEY_PREFIXES = {
    COURSE: 'course',
    COURSE_LIST: 'courses',
    USER: 'user',
    USER_PROFILE: 'user:profile',
    AUTH: 'auth',
    REFRESH_TOKEN: 'refreshToken',
    ACTIVE_SESSION: 'activeSession',
    OTP: 'otp',
    SETTINGS: 'settings',
    ENQUIRY: 'enquiry',
    ENQUIRY_LIST: 'enquiries',
};

export const REDIS_TTL = {
    SHORT: 60 * 5, // 5 minutes
    MEDIUM: 60 * 30, // 30 minutes
    LONG: 60 * 60 * 24, // 1 day
};
export const courseKeys = {
    detail: (id: string) => `${REDIS_KEY_PREFIXES.COURSE}:${id}`,
    list: () => `${REDIS_KEY_PREFIXES.COURSE_LIST}`,
    pattern: () => `${REDIS_KEY_PREFIXES.COURSE}:*`,
};

export const enquiryKeys = {
    detail: (id: string) => `${REDIS_KEY_PREFIXES.ENQUIRY}:${id}`,
    list: (includeDeleted = false) =>
        `${REDIS_KEY_PREFIXES.ENQUIRY_LIST}:${includeDeleted ? 'all' : 'active'}`,

    filtered: (filterHash: string) =>
        `${REDIS_KEY_PREFIXES.ENQUIRY_LIST}:filtered:${filterHash}`,

    pattern: () => `${REDIS_KEY_PREFIXES.ENQUIRY}:*`,

    listPattern: () => `${REDIS_KEY_PREFIXES.ENQUIRY_LIST}:*`,
};

export const authKeys = {
    refreshToken: (userId: string) => `${REDIS_KEY_PREFIXES.REFRESH_TOKEN}:${userId}`,

    registerOtp: (email: string) => `${REDIS_KEY_PREFIXES.OTP}:register:${email}`,

    resetOtp: (email: string) => `${REDIS_KEY_PREFIXES.OTP}:reset:${email}`,

    userProfile: (userId: string) => `${REDIS_KEY_PREFIXES.USER_PROFILE}:${userId}`,

    activeSession: (userId: string) => `${REDIS_KEY_PREFIXES.ACTIVE_SESSION}:${userId}`,

    userProfilePattern: () => `${REDIS_KEY_PREFIXES.USER_PROFILE}:*`,

    otpPattern: () => `${REDIS_KEY_PREFIXES.OTP}:*`,
};
