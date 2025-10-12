// hooks/TanStack/mutations/usePersonalInfo.ts

import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

interface PersonalInfoInput {
    email: string;
    name: string;
    phone: string;
}

export const usePersonalInfo = () => {
    return useMutation({
        mutationFn: async (data: PersonalInfoInput) => {
            const res = await api.post("/auth/register/personal", data);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Personal info saved");
        },
    });
};
