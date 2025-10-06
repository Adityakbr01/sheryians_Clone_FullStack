import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import { useAuthStore } from "@/store/auth";

type LoginInput = {
    email: string;
    password: string;
};

type LoginResponse = {
    message: string;
    accessToken: string;
    refreshToken?: string; // only if you want to use it manually
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
};

export const useLogin = () => {
    const { setAccessToken, setUser } = useAuthStore();

    return useMutation({
        mutationFn: async (data: LoginInput): Promise<LoginResponse> => {
            const res = await api.post("/auth/login", data);
            return res.data;
        },
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            setUser(data.user);
        },
        onError: (error: any) => {
            console.error("Login error:", error);
        },
    });
};
