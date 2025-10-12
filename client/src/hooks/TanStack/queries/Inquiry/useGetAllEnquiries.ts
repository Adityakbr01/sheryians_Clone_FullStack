import { useQuery } from "@tanstack/react-query";
import { Enquiry } from "../../mutations/Inquiry/enquiry.types";
import api from "@/api/axios";

// 📥 Get all enquiries (Admin)
const useGetAllEnquiries = () => {
    return useQuery({
        queryKey: ["enquiry"],
        queryFn: async () => {
            const res = await api.get<Enquiry[]>("/enquiry");
            return res.data;
        },
    });
};
export default useGetAllEnquiries;