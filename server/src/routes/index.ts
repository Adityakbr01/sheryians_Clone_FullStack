import { Router } from "express";
import authRouter from "@/routes/auth.routes";


const router = Router();

router.use("/auth", authRouter);

router.get("/health", (req, res) => {
    throw new Error("Files")
});

export default router;
