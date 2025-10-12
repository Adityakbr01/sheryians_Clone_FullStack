import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateEnquiryDto, Enquiry } from "./enquiry.types";
import api from "@/api/axios";

const useCreateEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateEnquiryDto) => {
            const res = await api.post<Enquiry>("/enquiry", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enquiry"] });
        },
    });
};

export default useCreateEnquiry;