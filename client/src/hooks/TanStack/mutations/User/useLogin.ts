import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import { useAuthStore, User } from "@/store/auth";
import { secureLocalStorage } from "@/utils/encryption";

type LoginInput = {
    email: string;
    password: string;
};

type LoginResponse = {
    message: string;
    accessToken: string;
    refreshToken?: string; // only if you want to use it manually
    user: User
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

            // Store the access token in secure storage
            // This ensures the token persists across browser sessions when "Remember Me" is checked
            secureLocalStorage.setItem("accessToken", data.accessToken);
        },
    });
};
