import express from "express";
import authRoutes from "./auth.routes";
import enquiryRoutes from "./enquiry.route";
import courseRoutes from "./course.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/enquiry", enquiryRoutes);
router.use("/courses", courseRoutes); // Add course routes

router.get("/health", (req, res) => {
    throw new Error("Files")
});

export default router;
