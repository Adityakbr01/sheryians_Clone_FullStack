import { Router } from "express";

import { protect } from "@/middleware/custom/user/protect";
import { roleCheck } from "@/middleware/custom/user/role.middleware";
import EnquiryController from "@/controllers/enquiry.controller";
import { validateRequest } from "@/middleware/custom/validateSchema";
import { createEnquirySchema, filterEnquirySchema } from "@/validators/enquiry.validation";
import { inquiryRateLimiter } from "@/utils/rateLimiter";

const router = Router();

// Create an enquiry
router.post("/", inquiryRateLimiter, validateRequest(createEnquirySchema), EnquiryController.createEnquiry); //tested

// Get all enquiries
router.get("/", protect, roleCheck("admin"), EnquiryController.getAllEnquiries); //tested

// Admin-only filter route
router.get("/filter", validateRequest(filterEnquirySchema), protect, roleCheck("admin"), EnquiryController.filterEnquiries); //tested

// Mark an enquiry as checked
router.patch("/check/:id", protect, roleCheck("admin"), EnquiryController.markEnquiryChecked); //tested

// Soft-delete an enquiry
router.delete("/:id", protect, roleCheck("admin"), EnquiryController.softDeleteEnquiry); //tested


export default router;
