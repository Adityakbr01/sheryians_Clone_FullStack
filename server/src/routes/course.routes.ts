import courseController from "@/controllers/course.controller";
import { prepareCourseBody } from "@/middleware/custom/course/prepareCourseBody";
import { upload } from "@/middleware/custom/upload";
import { protect } from "@/middleware/custom/user/protect";
import { roleCheck } from "@/middleware/custom/user/role.middleware";
import { cacheRoute } from "@/middleware/custom/cache.middleware";
import { REDIS_TTL } from "@/utils/redis/keys";
import express from "express";

const router = express.Router();

router.get("/", cacheRoute(REDIS_TTL.SHORT), courseController.getCourses);
router.get("/:id", cacheRoute(REDIS_TTL.MEDIUM), courseController.getCourseById);

router.use(protect, roleCheck("admin"));
router.post("/", upload.single("thumbnail"), prepareCourseBody, courseController.createCourse);
router.put("/:id", upload.single("thumbnail"), prepareCourseBody, courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);
export default router;