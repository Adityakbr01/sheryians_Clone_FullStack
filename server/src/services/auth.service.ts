import _config from "@/config";
import User from "@/models/Users/user.model";
import { sendEmail } from "@/services/email.service";
import { ApiError } from "@/utils/ApiError";
import { generateOtp, getRegisterOtp, storeRegisterOtp } from "@/utils/otp/otp";
import { deleteRefreshToken, getRefreshToken, storeRefreshToken } from "@/utils/redis/tokens";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authService = {
    register: async (email: string, password: string) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, "User already exists");
        }

        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);

        await User.create({
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

        await storeRegisterOtp(email, otpHash);
        await sendEmail(email, "Verify your email", `Your OTP is: ${otp}`);

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
        await sendEmail(email, "Resend OTP", `Your new OTP is: ${otp}`);

        return { message: "OTP resent successfully. Please check your email." };
    },
    updatePersonalInfo: async (email: string, name: string, phone: string) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Check if username is taken by another user
        const usernameTaken = await User.findOne({ username: name, _id: { $ne: user._id } });
        if (usernameTaken) {
            throw new ApiError(400, "Username already taken");
        }

        // Check if phone is taken by another user (if you're saving phone on user)
        const phoneTaken = await User.findOne({ phone, _id: { $ne: user._id } });
        if (phoneTaken) {
            throw new ApiError(400, "Phone number already in use");
        }

        name = name.trim();
        phone = phone.trim();

        // Update fields
        user.username = name;
        user.phone = phone;

        await user.save();

        return {
            message: "Personal info updated successfully",
            user: {
                email: user.email,
                name: user.username,
                phone: user.phone,
            },
        };
    },
    login: async (email: string, password: string) => {
        const user = await User.findOne({ email }).select("+password");
        if (!user) throw new ApiError(404, "User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

        if (!user.isVerified) throw new ApiError(403, "Email is not verified");

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to Redis (stateful layer)
        await storeRefreshToken(user.id, refreshToken);

        user.lastLogin = new Date();
        await user.save();

        return {
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.username,
            },
        }
    },
    logout: async (userId: string) => {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");
        await deleteRefreshToken(userId);
        user.refreshToken = undefined;
        await user.save();
        return { message: "Logged out successfully" };
    },
    refreshAccessToken: async (refreshToken: string) => {
        if (!refreshToken) throw new ApiError(401, "Refresh token missing");

        let payload: any;
        try {
            payload = jwt.verify(refreshToken, _config.ENV.JWT_REFRESH_TOKEN_SECRET as string);
        } catch {
            throw new ApiError(401, "Invalid refresh token");
        }

        const userId = payload.id;
        const storedToken = await getRefreshToken(userId);

        if (storedToken !== refreshToken) {
            throw new ApiError(401, "Refresh token not recognized");
        }

        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        // Rotate tokens (optional security best practice)
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        await storeRefreshToken(userId, newRefreshToken);

        return {
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    },
    getProfile: async (userId: string) => {
        const user = await User.findById(userId).select("-password -otp -otpExpiry -refreshToken");
        if (!user) throw new ApiError(404, "User not found");

        return {
            message: "Profile fetched successfully",
            user,
        };
    },
};

export default authService;
