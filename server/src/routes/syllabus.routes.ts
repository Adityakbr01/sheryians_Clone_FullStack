import express from "express";
import syllabusController from "@/controllers/syllabus.controller";
import { protect } from "@/middleware/custom/user/protect";
import { roleCheck } from "@/middleware/custom/user/role.middleware";
import { cacheRoute } from "@/middleware/custom/cache.middleware";
import { REDIS_TTL } from "@/utils/redis/keys";
import { syllabusSchema, updateSyllabusSchema, syllabusValidation } from "@/validators/syllabus";
import { validateSchema } from "@/middleware/custom/validateSchema";

const router = express.Router();

// Public route to get syllabus by course ID
router.get("/course/:courseId", cacheRoute(REDIS_TTL.MEDIUM), syllabusController.getSyllabusByCourseId);

// Protected routes for admin operations
router.use(protect, roleCheck("admin"));

// Main syllabus routes
router.post("/course/:courseId", validateSchema(syllabusSchema), syllabusController.createCourseSyllabus);
router.put("/course/:courseId", validateSchema(updateSyllabusSchema), syllabusController.updateCourseSyllabus);
router.delete("/course/:courseId", syllabusController.deleteCourseSyllabus);

// Section routes
router.post(
    "/course/:courseId/section",
    validateSchema(syllabusValidation.createSection),
    syllabusController.addSection
);
router.put(
    "/course/:courseId/section/:sectionIndex",
    validateSchema(syllabusValidation.createSection),
    syllabusController.updateSection
);

router.delete(
    "/course/:courseId/section/:sectionIndex",
    syllabusController.deleteSection
);
// Topic routes
router.post(
    "/course/:courseId/section/:sectionIndex/topic",
    validateSchema(syllabusValidation.createTopic),
    syllabusController.addTopic
);
router.put(
    "/course/:courseId/section/:sectionIndex/topic/:topicIndex",
    validateSchema(syllabusValidation.updateTopic),
    syllabusController.updateTopic
);
router.delete(
    "/course/:courseId/section/:sectionIndex/topic/:topicIndex",
    syllabusController.deleteTopic
);

// Subtopic routes
router.post(
    "/course/:courseId/section/:sectionIndex/topic/:topicIndex/subtopic",
    validateSchema(syllabusValidation.createSubtopic),
    syllabusController.addSubtopic
);
router.put(
    "/course/:courseId/section/:sectionIndex/topic/:topicIndex/subtopic/:subtopicIndex",
    validateSchema(syllabusValidation.updateSubtopic),
    syllabusController.updateSubtopic
);
router.delete(
    "/course/:courseId/section/:sectionIndex/topic/:topicIndex/subtopic/:subtopicIndex",
    syllabusController.deleteSubtopic
);

export default router;