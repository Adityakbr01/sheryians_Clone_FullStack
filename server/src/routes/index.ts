import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
    throw new Error("Files")
});

export default router;
