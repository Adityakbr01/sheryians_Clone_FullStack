// routes/authRoutes.ts

import { Router } from 'express';
import authController from '@/controllers/auth.controller';
import { protect } from '@/middleware/custom/user/protect';
import { validateRequest } from '@/middleware/custom/validateSchema';
import {
    registerSchema,
    otpSchema,
    personalInfoSchema,
    loginSchema,
    resendOtpSchema,
} from '@/validators/zod/auth';

const router = Router();

// 🔓 Public Routes

// @route   POST /register
// @desc    Register new user
router.post('/register', validateRequest(registerSchema), authController.register);

// @route   POST /register/verify-otp
// @desc    Verify user OTP
router.post('/register/verify-otp', validateRequest(otpSchema), authController.verifyOtp);

// @route   POST /register/resend-otp
// @desc    Resend OTP
router.post('/register/resend-otp', validateRequest(resendOtpSchema), authController.resendOtp);

// @route   POST /register/personal
// @desc    Complete personal info after OTP
router.post('/register/personal', validateRequest(personalInfoSchema), authController.personalInfo);

// @route   POST /login
// @desc    Login user and set tokens
router.post('/login', validateRequest(loginSchema), authController.login);

// 🔐 Protected Routes
router.use(protect);

// @route   POST /logout
// @desc    Logout user and clear cookies
router.post('/logout', authController.logout);

// @route   POST /refresh-token
// @desc    Refresh access token using refresh token
router.post('/refresh-token', authController.refreshToken);

// @route   GET /profile
// @desc    Get user profile
router.get('/profile', authController.getProfile);

export default router;
