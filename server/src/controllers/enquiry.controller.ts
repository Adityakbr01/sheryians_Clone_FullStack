import { Request, Response } from "express";
import { wrapAsync } from "@/utils/wrapAsync";
import { ApiResponder } from "@/utils/response";
import { ApiError } from "@/utils/ApiError";
import enquiriesService from "@/services/enquiry.service";
import { CreateEnquiryInput } from "@/validators/enquiry.validation";

const EnquiryController = {
    createEnquiry: wrapAsync(async (req: Request, res: Response) => {
        const enquiry = await enquiriesService.createEnquiry(req.body as CreateEnquiryInput);
        ApiResponder.success(res, 201, "Enquiry created successfully", enquiry)
    }),
    getAllEnquiries: wrapAsync(async (req: Request, res: Response) => {
        const enquiries = await enquiriesService.getAllEnquiries();
        ApiResponder.success(res, 200, "Enquiries fetched successfully", enquiries)
    }),
    markEnquiryChecked: wrapAsync(async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            throw new ApiError(400, "Enquiry ID is required");
        }
        const enquiry = await enquiriesService.markEnquiryChecked(id);
        if (!enquiry) {
            throw new ApiError(404, "Enquiry not found");
        }
        ApiResponder.success(res, 200, "Enquiry marked as checked", enquiry)
    }),
    softDeleteEnquiry: wrapAsync(async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            throw new ApiError(400, "Enquiry ID is required");
        }

        const enquiry = await enquiriesService.softDeleteEnquiry(id);
        if (!enquiry) {
            throw new ApiError(404, "Enquiry not found");
        }
        ApiResponder.success(res, 200, "Enquiry deleted successfully", enquiry)
    }),
    filterEnquiries: wrapAsync(async (req: Request, res: Response) => {
        const { datetimeFrom, datetimeTo, isChecked, isDeleted } = req.query;
        const filters = {
            datetimeFrom: datetimeFrom as string | undefined,
            datetimeTo: datetimeTo as string | undefined,
            isChecked: isChecked !== undefined ? isChecked === "true" : undefined,
            isDeleted: isDeleted !== undefined ? isDeleted === "true" : undefined,
        };
        const enquiries = await enquiriesService.filterEnquiries(filters);
        ApiResponder.success(res, 200, "Enquiries filtered successfully", enquiries)
    })
}

export default EnquiryController;