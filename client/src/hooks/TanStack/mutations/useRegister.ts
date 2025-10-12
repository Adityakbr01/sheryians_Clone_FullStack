// src/hooks/TanStack/mutations/useRegister.ts

import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

interface RegisterPayload {
    email: string;
    password: string;
}

export const useRegister = () => {
    return useMutation({
        mutationFn: async (payload: RegisterPayload) => {
            const res = await api.post("/auth/register", payload);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Registration successful");
        },
    });
};
