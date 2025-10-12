// controllers/auth.controller.ts
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '@/config/cookies';
import { AuthenticatedRequest } from '@/middleware/custom/user/protect';
import authService from '@/services/auth.service';
import { ApiResponder } from '@/utils/response';
import { wrapAsync } from '@/utils/wrapAsync';
import { LoginInput, OtpInput, PersonalInfoInput, RegisterInput, ResendOtpInput } from '@/validators/auth';
import { Request, Response } from 'express';


const authController = {
    register: wrapAsync(async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body as RegisterInput;
        const result = await authService.register(email, password);
        ApiResponder.success(res, 201, result.message)
    }),
    verifyOtp: wrapAsync(async (req: Request, res: Response): Promise<void> => {
        const { email, otp } = req.body as OtpInput;
        const result = await authService.verifyOtp(email, otp);
        ApiResponder.success(res, 200, result.message);
    }),
    resendOtp: wrapAsync(async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body as ResendOtpInput;
        const result = await authService.resendOtp(email);
        ApiResponder.success(res, 200, result.message);
    }),
    personalInfo: wrapAsync(async (req: Request, res: Response) => {
        const { email, name, phone } = req.body as PersonalInfoInput;
        const result = await authService.updatePersonalInfo(email, name, phone);
        ApiResponder.success(res, 200, result.message);
    }),
    login: wrapAsync(async (req: Request, res: Response) => {
        const { email, password } = req.body as LoginInput;
        const result = await authService.login(email, password);
        res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);
        ApiResponder.success(res, 200, result.message, {
            user: result.user,
            accessToken: result.accessToken,
            message: result.message
        });
    }),
    logout: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
        const userId = req?.user?.id; // from auth middleware
        if (!userId) throw new Error("User not found");
        const result = await authService.logout(userId);
        res.clearCookie("accessToken", accessTokenCookieOptions);
        res.clearCookie("refreshToken", refreshTokenCookieOptions);
        ApiResponder.success(res, 200, result.message, {
            message: result.message
        });
    }),
    refreshToken: wrapAsync(async (req: Request, res: Response) => {
        let refreshToken = req.cookies.refreshToken;
        const result = await authService.refreshAccessToken(refreshToken);
        res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);
        ApiResponder.success(res, 200, result.message, {
            accessToken: result.accessToken,
        });
    }),
    getProfile: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
        const userId = req?.user?.id; // from auth middleware
        if (!userId) throw new Error("User not found");
        const result = await authService.getProfile(userId);
        ApiResponder.success(res, 200, result.message, {
            user: result.user,
            message: result.message
        });
    }),
}

export default authController;