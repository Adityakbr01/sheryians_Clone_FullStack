import courseService from "@/services/course.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponder } from "@/utils/response";
import { wrapAsync } from "@/utils/wrapAsync";
import { createCourseSchema } from "@/validators/course";
import { Request, Response } from "express";
import { clearRouteCache } from "@/middleware/custom/cache.middleware";


const courseController = {
    getCourses: wrapAsync(async (req: Request, res: Response) => {
        const courses = await courseService.getAllCourses();
        ApiResponder.success(res, 200, "Courses fetched successfully", courses);
    }),
    getCourseById: wrapAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new ApiError(400, "Course ID is required");
        const course = await courseService.getCourseById(id);
        if (!course) throw new ApiError(404, "Course not found");
        ApiResponder.success(res, 200, "Course fetched successfully", course);
    }),
    createCourse: wrapAsync(async (req: Request, res: Response) => {
        const parsed = createCourseSchema.parse(req.body);
        const course = await courseService.createCourse(parsed);
        await clearRouteCache(['/api/v1/courses']);
        ApiResponder.success(res, 201, "Course created successfully", course);
    }),
    updateCourse: wrapAsync(async (req, res) => {
        const id = req.params.id;
        if (!id) {
            throw new ApiError(400, "Course id Required")
        }
        const parsed = createCourseSchema.parse(req.body);
        const course = await courseService.updateCourse(id, parsed);

        // Ensure we clear all related route caches after updating with the correct API path
        await clearRouteCache([
            '/api/v1/courses',
            `/api/v1/courses/${id}`
        ]);

        ApiResponder.success(res, 200, "Course updated successfully", course);
    }),
    deleteCourse: wrapAsync(async (req, res) => {
        const id = req.params.id;
        if (!id) {
            throw new ApiError(400, "Course id Required")
        }
        const course = await courseService.deleteCourse(id);
        await clearRouteCache([
            '/api/v1/courses',
            `/api/v1/courses/${id}`
        ]);

        ApiResponder.success(res, 200, "Course deleted successfully", { data: course });
    }),
}

export default courseController;