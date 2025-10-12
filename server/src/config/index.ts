import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// 1️⃣ Define the Zod schema for your env variables
const envSchema = z.object({
    PORT: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val), { message: "PORT must be a number" }),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),
    // JWT 
    JWT_ACCESS_TOKEN_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
    JWT_REFRESH_TOKEN_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
    ACCESS_Token_Expiry: z.string().transform((val) => {
        const num = Number(val);
        if (isNaN(num)) throw new Error("ACCESS_Token_Expiry must be a number in seconds");
        return num;
    }),
    REFRESH_Token_Expiry: z.string().transform((val) => {
        const num = Number(val);
        if (isNaN(num)) throw new Error("REFRESH_Token_Expiry must be a number in seconds");
        return num;
    }),

    // Gemail
    SMTP_USER: z.string().min(1, "SMTP_USER is required"),
    SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
    NODE_ENV: z.enum(["development", "production", "test"]),
});

// 2️⃣ Parse and validate process.env
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("❌ Invalid environment variables:", parsedEnv.error.format());
    throw new Error("Invalid environment variables. Check your .env file!");
}

// 3️⃣ Determine host based on NODE_ENV
const HOST =
    parsedEnv.data.NODE_ENV === "development"
        ? "http://localhost:" + parsedEnv.data.PORT
        : parsedEnv.data.CLIENT_URL;

// 4️⃣ Export the validated config
const _config = {
    ENV: {
        PORT: parsedEnv.data.PORT,
        MONGO_URI: parsedEnv.data.MONGO_URI,
        CLIENT_URL: parsedEnv.data.CLIENT_URL,
        // JWT 
        JWT_REFRESH_TOKEN_SECRET: parsedEnv.data.JWT_REFRESH_TOKEN_SECRET,
        JWT_ACCESS_TOKEN_SECRET: parsedEnv.data.JWT_ACCESS_TOKEN_SECRET,
        ACCESS_Token_Expiry: parsedEnv.data.ACCESS_Token_Expiry,
        REFRESH_Token_Expiry: parsedEnv.data.REFRESH_Token_Expiry,
        // NODE_ENV
        NODE_ENV: parsedEnv.data.NODE_ENV,
        HOST,
        nodeEnv: parsedEnv.data.NODE_ENV,

        // Gemail
        SMTP_USER: parsedEnv.data.SMTP_USER,
        SMTP_PASS: parsedEnv.data.SMTP_PASS,
    },
};

export default _config;
