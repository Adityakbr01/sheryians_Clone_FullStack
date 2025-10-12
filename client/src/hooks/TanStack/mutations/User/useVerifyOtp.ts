// hooks/TanStack/mutations/useVerifyOtp.ts

import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

interface VerifyOtpInput {
    email: string;
    otp: string;
}

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: async (data: VerifyOtpInput) => {
            const res = await api.post("/auth/register/verify-otp", data);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "OTP verified");
        },
    });
};
