import { registerEmailQueue, registerEmailQueueName } from "@/bull";
import _config from "@/config";
import User from "@/models/Users/user.model";
import { sendEmail } from "@/services/email.service";
import { ApiError } from "@/utils/ApiError";
import { deleteRegisterOtp, generateOtp, getRegisterOtp, storeRegisterOtp } from "@/utils/otp/otp";
import {
    cacheUserProfile,
    deleteRefreshToken,
    getCachedUserProfile,
    getRefreshToken,
    invalidateUserProfile,
    storeRefreshToken,
    storeActiveSession,
    getActiveSession,
    deleteActiveSession
} from "@/utils/redis/tokens";
import { REDIS_TTL } from "@/utils/redis/keys";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "@/utils/logger";

const authService = {
    register: async (email: string, password: string) => {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                throw new ApiError(400, "User already exists");
            } else {
                throw new ApiError(409, "User already registered but not verified. Please verify your email.");
            }
        }

        // Base username from email
        const baseUsername = email.split("@")[0];
        let username = baseUsername;
        let counter = 0;

        // Generate OTP
        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);

        // Try creating the user with unique username
        while (true) {
            try {
                await User.create({
                    username,
                    email,
                    password,
                    isVerified: false,
                    otp: otpHash,
                    createdAt: new Date(),
                    isBanned: false,
                    role: "student",
                    enrolledCourses: [],
                    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
                });
                break; // success, exit loop
            } catch (err: any) {
                // If duplicate username error, increment counter and retry
                if (err.code === 11000 && err.keyPattern?.username) {
                    counter++;
                    username = `${baseUsername}${counter}`; // e.g., "abcd0031", "abcd0032"
                } else {
                    // other errors, rethrow
                    throw err;
                }
            }
        }

        // Store OTP and send email
        await storeRegisterOtp(email, otpHash);
        await registerEmailQueue.add(registerEmailQueueName, { email, otp });

        return { message: "Registration successful. Please verify your email." };
    },
    verifyOtp: async (email: string, otp: string) => {
        const user = await User.findOne({ email });
        if (!user) throw new ApiError(404, "User not found");

        if (user.isVerified) {
            return { message: "Email already verified" };
        }

        const storedOtpHash = await getRegisterOtp(email);
        if (!storedOtpHash) throw new ApiError(400, "OTP expired or invalid");

        const isValid = await bcrypt.compare(otp, storedOtpHash);
        if (!isValid) throw new ApiError(400, "Invalid OTP");

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.isEmailVerified = true;
        await user.save();

        await deleteRegisterOtp(email);

        return { message: "Email verified successfully" };
    },
    resendOtp: async (email: string) => {
        const user = await User.findOne({ email });
        if (!user) throw new ApiError(404, "User not found");

        if (user.isVerified) {
            return { message: "Email is already verified" };
        }

        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);

        user.otp = otpHash;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        await storeRegisterOtp(email, otpHash);
        await registerEmailQueue.add(registerEmailQueueName, { email, otp })


        return { message: "OTP resent successfully. Please check your email." };
    },
    updatePersonalInfo: async (email: string, name: string, phone: string) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const usernameTaken = await User.findOne({ username: name, _id: { $ne: user._id } });
        if (usernameTaken) {
            throw new ApiError(400, "Username already taken");
        }

        const phoneTaken = await User.findOne({ phone, _id: { $ne: user._id } });
        if (phoneTaken) {
            throw new ApiError(400, "Phone number already in use");
        }

        name = name.trim();
        phone = phone.trim();

        user.username = name;
        user.phone = phone;

        await user.save();

        await invalidateUserProfile(user.id);

        const updatedInfo = {
            email: user.email,
            name: user.username,
            phone: user.phone,
        };

        await cacheUserProfile(user.id, updatedInfo, REDIS_TTL.MEDIUM);

        return {
            message: "Personal info updated successfully",
            user: updatedInfo,
        };
    },
    login: async (email: string, password: string, deviceInfo = "Unknown device") => {
        const user = await User.findOne({ email }).select("+password");
        if (!user) throw new ApiError(404, "User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

        if (!user.isVerified) throw new ApiError(403, "Email is not verified");

        // Generate a unique session ID for this login
        const sessionId = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        // Check if there is an existing session
        const existingSession = await getActiveSession(user.id);
        if (existingSession) {
            logger.info(`User ${user.id} already has an active session on ${existingSession.deviceInfo}. Invalidating previous session.`);

            // Clear the previous session
            await deleteActiveSession(user.id);
            await deleteRefreshToken(user.id);
        }

        // Generate tokens with the sessionId embedded
        const accessToken = user.generateAccessToken(sessionId);
        const refreshToken = user.generateRefreshToken(sessionId);        // Store the refresh token
        await storeRefreshToken(user.id, refreshToken);

        // Store the active session
        await storeActiveSession(user.id, sessionId, deviceInfo, 60 * 60 * 24 * 7); // 7 days

        user.lastLogin = new Date();
        await user.save();

        const userData = {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.username,
            lastLogin: user.lastLogin,
            isEmailVerified: user.isEmailVerified,
            phone: user.phone,
            avatar: user.avatar,
            sessionId: sessionId
        };

        await cacheUserProfile(user.id, userData, REDIS_TTL.MEDIUM);

        logger.debug(`User ${user.id} logged in successfully with session ${sessionId}`);

        return {
            message: "Login successful",
            accessToken,
            refreshToken,
            user: userData,
        }
    },
    logout: async (userId: string) => {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        // Get the active session before deletion for logging
        const session = await getActiveSession(userId);

        // Delete refresh token and active session
        await deleteRefreshToken(userId);
        await deleteActiveSession(userId);

        // Invalidate user profile cache
        await invalidateUserProfile(userId);

        user.refreshToken = undefined;
        await user.save();

        if (session) {
            logger.debug(`User ${userId} logged out successfully from device ${session.deviceInfo}`);
        } else {
            logger.debug(`User ${userId} logged out successfully`);
        }

        return { message: "Logged out successfully" };
    },
    refreshAccessToken: async (refreshToken: string, deviceInfo?: string) => {
        if (!refreshToken) throw new ApiError(401, "Refresh token missing");
        let payload: any;
        try {
            payload = jwt.verify(refreshToken, _config.ENV.JWT_REFRESH_TOKEN_SECRET as string);
        } catch {
            throw new ApiError(401, "Invalid refresh token");
        }

        const userId = payload.id;
        const tokenSessionId = payload.sid;

        // Check if active session exists for this user
        const activeSession = await getActiveSession(userId);
        if (!activeSession) {
            logger.warn(`No active session found for user ${userId} during token refresh`);
            throw new ApiError(401, "Session expired. Please login again");
        }

        // Verify session ID if present in token
        if (tokenSessionId && tokenSessionId !== activeSession.sessionId) {
            logger.warn(`Session ID mismatch for user ${userId} during token refresh: token=${tokenSessionId}, redis=${activeSession.sessionId}`);
            throw new ApiError(401, "Session expired or logged in from another device");
        }

        const storedToken = await getRefreshToken(userId);
        if (storedToken !== refreshToken) {
            logger.warn(`Refresh token mismatch for user ${userId}`);
            throw new ApiError(401, "Session expired or logged in from another device");
        }

        // Update device info if provided
        if (deviceInfo && deviceInfo !== activeSession.deviceInfo) {
            logger.debug(`Updating device info for user ${userId}`);
            await storeActiveSession(userId, activeSession.sessionId, deviceInfo);
        }

        const cachedUser = await getCachedUserProfile<{
            id: string;
            email: string;
            role: string;
            name: string;
            sessionId: string;
        }>(userId);

        if (cachedUser && cachedUser.id) {
            // Verify session ID if available
            if (cachedUser.sessionId && cachedUser.sessionId !== activeSession.sessionId) {
                logger.warn(`Session ID mismatch for user ${userId}`);
                throw new ApiError(401, "Session expired or logged in from another device");
            }

            const newAccessToken = jwt.sign(
                {
                    id: cachedUser.id,
                    email: cachedUser.email,
                    role: cachedUser.role,
                    sid: activeSession.sessionId  // Include session ID in token
                },
                _config.ENV.JWT_ACCESS_TOKEN_SECRET as string,
                { expiresIn: "15m" }
            );
            logger.debug(`Access token refreshed from cache for user ${userId}`);

            return {
                message: "Token refreshed successfully",
                accessToken: newAccessToken,
            };
        }

        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        const newAccessToken = user.generateAccessToken(activeSession.sessionId);

        const userData = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.username,
            sessionId: activeSession.sessionId,
        };

        await cacheUserProfile(userId, userData, REDIS_TTL.MEDIUM);

        return {
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
        };
    },
    getProfile: async (userId: string) => {
        const cachedProfile = await getCachedUserProfile(userId);

        if (cachedProfile) {
            logger.debug(`User profile ${userId} served from cache`);
            return {
                message: "Profile fetched successfully",
                user: cachedProfile,
                fromCache: true,
            };
        }
        const user = await User.findById(userId).select("-password -otp -otpExpiry -refreshToken");
        if (!user) throw new ApiError(404, "User not found");

        const userProfile = user.toObject();
        await cacheUserProfile(userId, userProfile, REDIS_TTL.MEDIUM);

        return {
            message: "Profile fetched successfully",
            user: userProfile,
        };
    },
};

export default authService;
