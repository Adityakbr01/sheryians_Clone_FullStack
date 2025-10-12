import { sendEmail } from "@/services/email.service";
import { Job } from "bullmq";

export interface RegisterEmailJobData {
    email: string;
    otp: string;
}

export const processRegisterEmailJob = async (job: Job<RegisterEmailJobData>) => {
    const { email, otp } = job.data;
    console.log(`Sending welcome email to ${email} for user ${otp}`);
    await sendEmail(email, "Verify your email", `Your OTP is: ${otp}`);
};
