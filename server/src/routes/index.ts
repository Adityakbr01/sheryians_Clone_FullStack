import { Router } from "express";
import authRouter from "@/routes/auth.routes";
import enquiryRouter from "@/routes/enquiry.route"

const router = Router();

router.use("/auth", authRouter);
router.use("/enquiry", enquiryRouter);


router.get("/health", (req, res) => {
    throw new Error("Files")
});

export default router;
