import { ApiError } from "@/utils/ApiError";
import { CreateCourseInput } from "@/validators/course";
import Course from "../models/Courses/course.model";
import { cloudinaryService, extractCloudinaryPublicId } from "./cloudinary.service";
import logger from "@/utils/logger";
import { RedisCache } from "@/utils/redis/cache";
import { REDIS_TTL, courseKeys } from "@/utils/redis/keys";
const courseService = {
    getAllCourses: async () => {
        const cacheKey = courseKeys.list();
        const cachedCourses = await RedisCache.get(cacheKey);

        if (cachedCourses) {
            logger.debug("Course list retrieved from cache");
            return cachedCourses;
        }

        const courses = await Course.find();
        await RedisCache.set(cacheKey, courses, REDIS_TTL.SHORT);
        return courses;
    },
    getCourseById: async (id: string) => {
        const cacheKey = courseKeys.detail(id);

        const course = await Course.findById(id)

        // Only cache if we found a course
        if (course) {
            // Convert to plain object before caching to maintain populated fields
            await RedisCache.set(cacheKey, course.toObject(), REDIS_TTL.MEDIUM);
        }

        return course;
    },
    createCourse: async (courseData: CreateCourseInput) => {
        // 🛡️ Check if course already exists
        const isAlreadyExist = await Course.findOne({ title: courseData.title }).exec();
        if (isAlreadyExist) {
            throw new ApiError(400, "Course with this title already exists");
        }

        // 💰 Calculate final price
        const discountAmount = (courseData.originalPrice * courseData.discountPercentage) / 100;
        const finalPrice = courseData.originalPrice - discountAmount;

        // 📝 Create course
        const course = new Course({
            ...courseData,
            price: finalPrice,
        });
        const savedCourse = await course.save();

        // 🧹 Clear cache
        await RedisCache.del(courseKeys.list());
        return savedCourse;
    },
    updateCourse: async (id: string, courseData: any) => {
        const course = await Course.findById(id);
        if (!course) throw new ApiError(404, "Course not found");

        if (courseData.thumbnail && course.thumbnail) {
            try {
                const publicId = extractCloudinaryPublicId(course.thumbnail);
                await cloudinaryService.delete(publicId);
            } catch (err) {
                logger.error("Failed to delete old thumbnail:", err);
            }
        }

        console.log("Updating course with data:", courseData);

        Object.assign(course, courseData);
        const updatedCourse = await course.save();

        // First delete the existing course detail cache to ensure it's refreshed
        const courseDetailKey = courseKeys.detail(id);
        await RedisCache.del(courseDetailKey);

        // Then set the updated course in cache
        await RedisCache.set(courseDetailKey, updatedCourse);

        // Also delete the course list cache to ensure it's refreshed
        await RedisCache.del(courseKeys.list());

        return updatedCourse;
    },
    deleteCourse: async (id: string) => {
        const course = await Course.findById(id);
        if (!course) throw new ApiError(404, "Course not found");

        if (course.thumbnail) {
            try {
                const publicId = extractCloudinaryPublicId(course.thumbnail);
                await cloudinaryService.delete(publicId);
            } catch (err) {
                logger.error("Failed to delete thumbnail:", err);
            }
        }

        await course.deleteOne();

        await RedisCache.del(courseKeys.detail(id));
        await RedisCache.del(courseKeys.list());

        return course;
    },
}

export default courseService;

