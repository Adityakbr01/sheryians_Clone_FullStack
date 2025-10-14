import { Router } from "express";

import { protect } from "@/middleware/custom/user/protect";
import { roleCheck } from "@/middleware/custom/user/role.middleware";
import EnquiryController from "@/controllers/enquiry.controller";
import { validateSchema } from "@/middleware/custom/validateSchema";
import { createEnquirySchema, filterEnquirySchema } from "@/validators/enquiry.validation";
import { inquiryRateLimiter } from "@/utils/rateLimiter";
import { cacheRoute } from "@/middleware/custom/cache.middleware";
import { REDIS_TTL } from "@/utils/redis/keys";

const router = Router();

// Create an enquiry
router.post("/", inquiryRateLimiter, validateSchema(createEnquirySchema), EnquiryController.createEnquiry); //tested

// Get all enquiries with caching
router.get("/", protect, roleCheck("admin"), cacheRoute(REDIS_TTL.SHORT), EnquiryController.getAllEnquiries); //tested

// Admin-only filter route with caching
router.get("/filter", validateSchema(filterEnquirySchema), protect, roleCheck("admin"), cacheRoute(REDIS_TTL.SHORT), EnquiryController.filterEnquiries); //tested

// Mark an enquiry as checked
router.patch("/check/:id", protect, roleCheck("admin"), EnquiryController.markEnquiryChecked); //tested

// Soft-delete an enquiry
router.delete("/:id", protect, roleCheck("admin"), EnquiryController.softDeleteEnquiry); //tested


export default router;
