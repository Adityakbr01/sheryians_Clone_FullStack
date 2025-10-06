// hooks/TanStack/mutations/useResendOtp.ts

import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

interface ResendOtpInput {
    email: string;
}

export const useResendOtp = () => {
    return useMutation({
        mutationFn: async (data: ResendOtpInput) => {
            const res = await api.post("/auth/register/resend-otp", data);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "OTP resent");
        },
    });
};
