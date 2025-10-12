import { useQuery } from "@tanstack/react-query";
import { Enquiry, FilterEnquiryParams } from "../../mutations/Inquiry/enquiry.types";
import api from "@/api/axios";

// 🔎 Filter enquiries (Admin)
const useFilterEnquiries = (params: FilterEnquiryParams) => {
    return useQuery({
        queryKey: ["enquiry", "filter", params],
        queryFn: async () => {
            const res = await api.get<Enquiry[]>("/enquiry/filter", { params });
            return res.data;
        },
        enabled: Object.keys(params).length > 0, // only fetch when filters exist
    });
};

export default useFilterEnquiries;