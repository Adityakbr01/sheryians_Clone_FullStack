import express from "express";
import authRoutes from "./auth.routes";
import enquiryRoutes from "./enquiry.route";
import courseRoutes from "./course.routes";
import { ApiResponder } from "@/utils/response";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/enquiry", enquiryRoutes);
router.use("/courses", courseRoutes);

router.get("/health", (req, res) => {
    ApiResponder.success(res, 200, "Server is healthy", { status: "OK" });
});

export default router;
