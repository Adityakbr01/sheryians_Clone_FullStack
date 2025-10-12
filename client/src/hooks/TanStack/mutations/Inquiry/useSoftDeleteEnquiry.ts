import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Enquiry } from "./enquiry.types";

// 🗑️ Soft delete enquiry
const useSoftDeleteEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete<{ message: string; enquiry: Enquiry }>(
                `/enquiry/${id}`
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enquiry"] });
        },
    });
};

export default useSoftDeleteEnquiry;