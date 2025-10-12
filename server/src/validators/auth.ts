import z from "zod";

// ========== ZOD SCHEMAS ==========
const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
    email: z.string().email("Invalid email"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});
const resendOtpSchema = z.object({
    email: z.email("Invalid email"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6),
});

const personalInfoSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    phone: z.string().min(10),
});



// ========== TYPES ==========
type RegisterInput = z.infer<typeof registerSchema>;
type OtpInput = z.infer<typeof otpSchema>;
type ResendOtpInput = z.infer<typeof resendOtpSchema>;
type LoginInput = z.infer<typeof loginSchema>;
type PersonalInfoInput = z.infer<typeof personalInfoSchema>;

export {
    registerSchema,
    otpSchema,
    resendOtpSchema,
    ResendOtpInput,
    loginSchema,
    personalInfoSchema,
    RegisterInput,
    OtpInput,
    LoginInput,
    PersonalInfoInput,
};
