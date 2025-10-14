import { clearRouteCache } from "@/middleware/custom/cache.middleware";
import syllabusService from "@/services/syllabus.service";
import { ISection } from "@/types/models/courses/courseSyllabus";
import { ApiError } from "@/utils/ApiError";
import { ApiResponder } from "@/utils/response";
import { wrapAsync } from "@/utils/wrapAsync";
import { Request, Response } from "express";

const syllabusController = {
    getSyllabusByCourseId: wrapAsync(async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        if (!courseId) {
            throw new ApiError(400, "Course ID is required");
        }

        const syllabus = await syllabusService.getSyllabusByCourseId(courseId);

        ApiResponder.success(
            res,
            200,
            "Course syllabus retrieved successfully",
            syllabus
        );
    }),
    createCourseSyllabus: wrapAsync(async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        if (!courseId) {
            throw new ApiError(400, "Course ID is required");
        }

        const syllabusData = req.body.syllabus as ISection[];
        if (!syllabusData || !Array.isArray(syllabusData)) {
            throw new ApiError(400, "Valid syllabus data is required");
        }

        const newSyllabus = await syllabusService.createCourseSyllabus(courseId, syllabusData);

        // Invalidate related caches
        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`
        ]);

        ApiResponder.success(
            res,
            201,
            "Course syllabus created successfully",
            newSyllabus
        );
    }),
    updateCourseSyllabus: wrapAsync(async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        if (!courseId) {
            throw new ApiError(400, "Course ID is required");
        }

        const syllabusData = req.body.syllabus as ISection[];
        if (!syllabusData || !Array.isArray(syllabusData)) {
            throw new ApiError(400, "Valid syllabus data is required");
        }

        const updatedSyllabus = await syllabusService.updateCourseSyllabus(courseId, syllabusData);

        // Invalidate related caches
        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`
        ]);

        ApiResponder.success(
            res,
            200,
            "Course syllabus updated successfully",
            updatedSyllabus
        );
    }),
    deleteCourseSyllabus: wrapAsync(async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        if (!courseId) {
            throw new ApiError(400, "Course ID is required");
        }

        await syllabusService.deleteCourseSyllabus(courseId);

        // Invalidate related caches
        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`
        ]);

        ApiResponder.success(
            res,
            200,
            "Course syllabus deleted successfully"
        );
    }),
}

export default syllabusController