// services/otpService.ts
import { connectRedis } from '@/lib/redis'; // Adjust path as needed
import logger from '@/utils/logger';

const redis = connectRedis();

// Generate 6-digit OTP
export const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiry (10 minutes)
export const storeOtp = async (email: string, otp: string): Promise<void> => {
    try {
        await redis.setex(`otp:${email}`, 600, otp); // 600 seconds = 10 min
        logger.info(`OTP stored for ${email}`);
    } catch (error) {
        logger.error('Error storing OTP', error);
        throw error;
    }
};

// Verify OTP
export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
        const storedOtp = await redis.get(`otp:${email}`);
        if (storedOtp && storedOtp === otp) {
            await redis.del(`otp:${email}`); // Delete after verification
            logger.info(`OTP verified for ${email}`);
            return true;
        }
        logger.warn(`Invalid OTP for ${email}`);
        return false;
    } catch (error) {
        logger.error('Error verifying OTP', error);
        return false;
    }
};