import Enquiry from "@/models/inquery.model";
import { FilterParams, IEnquiry } from "@/types/models/courses/enquiry";
import { ApiError } from "@/utils/ApiError";

const enquiriesService = {
    createEnquiry: async (data: Partial<IEnquiry>) => {
        if (!data.phone) throw new Error("Phone is required");

        // 🚫 Check if the same phone submitted recently
        const cooldownMinutes = 10;
        const cooldownTime = new Date(Date.now() - cooldownMinutes * 60 * 1000);

        const recentEnquiry = await Enquiry.findOne({
            phone: data.phone,
            createdAt: { $gte: cooldownTime },
            isDeleted: false,
        });

        if (recentEnquiry) {
            throw new ApiError(400,
                `Too many requests. Please wait ${cooldownMinutes} minutes before submitting again.`
            );
        }

        // ✅ If no recent enquiry, create a new one
        const enquiry = new Enquiry(data);
        return await enquiry.save();
    },
    getAllEnquiries: async (includeDeleted = false) => {
        const filter = includeDeleted ? {} : { isDeleted: false };
        return await Enquiry.find(filter).sort({ createdAt: -1 });
    },
    markEnquiryChecked: async (id: string) => {
        return await Enquiry.findByIdAndUpdate(id, { isChecked: true }, { new: true });
    },
    softDeleteEnquiry: async (id: string) => {
        return await Enquiry.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    },
    filterEnquiries: async (filters: FilterParams) => {
        const query: any = {};

        if (filters.datetimeFrom || filters.datetimeTo) {
            query.datetime = {};
            if (filters.datetimeFrom) query.datetime.$gte = new Date(filters.datetimeFrom);
            if (filters.datetimeTo) query.datetime.$lte = new Date(filters.datetimeTo);
        }

        if (filters.isChecked !== undefined) query.isChecked = filters.isChecked;
        if (filters.isDeleted !== undefined) query.isDeleted = filters.isDeleted;

        return await Enquiry.find(query).sort({ datetime: -1 });
    },
}

export default enquiriesService;