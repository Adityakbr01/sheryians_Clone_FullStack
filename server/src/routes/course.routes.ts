import courseController from "@/controllers/course.controller";
import { prepareCourseBody } from "@/middleware/custom/course/prepareCourseBody";
import { upload } from "@/middleware/custom/upload";
import { protect } from "@/middleware/custom/user/protect";
import { roleCheck } from "@/middleware/custom/user/role.middleware";
import express from "express";

const router = express.Router();

// Public Routes
//Routes Tested
router.get("/", courseController.getCourses); // Get all courses
router.get("/:id", courseController.getCourseById); // Get a single course by ID


router.use(protect, roleCheck("admin"));
// Apply thumbnail upload middleware before validation
router.post("/", upload.single("thumbnail"), prepareCourseBody, courseController.createCourse);
// Also handle thumbnails in update route
router.put("/:id", upload.single("thumbnail"), prepareCourseBody, courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);
export default router;