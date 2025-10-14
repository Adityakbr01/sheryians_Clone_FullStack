// routes/authRoutes.ts

import authController from '@/controllers/auth.controller';
import { protect } from '@/middleware/custom/user/protect';
import { validateSchema } from '@/middleware/custom/validateSchema';
import { cacheRoute } from '@/middleware/custom/cache.middleware';
import { otpRateLimiter } from '@/utils/rateLimiter';
import { REDIS_TTL } from '@/utils/redis/keys';
import {
    loginSchema,
    otpSchema,
    personalInfoSchema,
    registerSchema,
    resendOtpSchema,
} from '@/validators/auth';
import { Router } from 'express';

const router = Router();

// 🔓 Public Routes
router.post('/register', otpRateLimiter, validateSchema(registerSchema), authController.register);
router.post('/register/verify-otp', validateSchema(otpSchema), authController.verifyOtp);
router.post('/register/resend-otp', otpRateLimiter, validateSchema(resendOtpSchema), authController.resendOtp);
router.post('/register/personal', validateSchema(personalInfoSchema), authController.personalInfo);
router.post('/login', validateSchema(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);


// 🔐 Protected Routes
router.use(protect);

router.post('/logout', authController.logout);
router.get('/profile', cacheRoute(REDIS_TTL.SHORT), authController.getProfile);

export default router;
