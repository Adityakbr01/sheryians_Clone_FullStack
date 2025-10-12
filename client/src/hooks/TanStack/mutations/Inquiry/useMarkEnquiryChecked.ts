import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Enquiry } from "./enquiry.types";

// ✅ Mark enquiry as checked
const useMarkEnquiryChecked = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.patch<Enquiry>(`/enquiry/check/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enquiry"] });
        },
    });
};

export default useMarkEnquiryChecked;