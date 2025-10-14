import express from "express";
import syllabusController from "@/controllers/syllabus.controller";
import { protect } from "@/middleware/custom/user/protect";
import { roleCheck } from "@/middleware/custom/user/role.middleware";
import { cacheRoute } from "@/middleware/custom/cache.middleware";
import { REDIS_TTL } from "@/utils/redis/keys";
import { syllabusSchema, updateSyllabusSchema } from "@/validators/syllabus";
import { validateSchema } from "@/middleware/custom/validateSchema";

const router = express.Router();

// Public route to get syllabus by course ID
router.get("/course/:courseId", cacheRoute(REDIS_TTL.MEDIUM), syllabusController.getSyllabusByCourseId);

// Protected routes for admin operations
router.use(protect, roleCheck("admin"));
router.post("/course/:courseId", validateSchema(syllabusSchema), syllabusController.createCourseSyllabus);
router.put("/course/:courseId", validateSchema(updateSyllabusSchema), syllabusController.updateCourseSyllabus);
router.delete("/course/:courseId", syllabusController.deleteCourseSyllabus);

export default router;