import { ApiError } from "@/utils/ApiError";
import { CreateCourseInput } from "@/validators/course";
import Course from "../models/Courses/course.model";
import { cloudinaryService, extractCloudinaryPublicId } from "./cloudinary.service";

const courseService = {
    getAllCourses: async () => {
        return await Course.find()
        // populate("CourseSyllabusSchema").exec();
    },
    getCourseById: async (id: string) => {
        return await Course.findById(id)
        //.populate("CourseSyllabusSchema").exec();
    },
    createCourse: async (courseData: CreateCourseInput) => {
        const isAlreadyExist = await Course.findOne({ title: courseData.title }).exec();
        if (isAlreadyExist) {
            throw new ApiError(400, "Course with this title already exists");
        }

        // 🧮 Calculate price after discount
        const discountAmount = (courseData.originalPrice * courseData.discountPercentage) / 100;
        const finalPrice = courseData.originalPrice - discountAmount;

        const course = new Course({
            ...courseData,
            price: finalPrice, // 👈 final price store in DB
        });

        return await course.save();
    },
    updateCourse: async (id: string, courseData: any) => {
        const course = await Course.findById(id);
        if (!course) throw new ApiError(404, "Course not found");
        if (courseData.thumbnail && course.thumbnail) {
            try {
                const publicId = extractCloudinaryPublicId(course.thumbnail);
                await cloudinaryService.delete(publicId);
            } catch (err) {
                console.error("Failed to delete old thumbnail:", err);
            }
        }
        Object.assign(course, courseData);
        return await course.save();
    },
    deleteCourse: async (id: string) => {
        const course = await Course.findById(id);
        if (!course) throw new ApiError(404, "Course not found");

        // ✅ Delete thumbnail from Cloudinary
        if (course.thumbnail) {
            try {
                const publicId = extractCloudinaryPublicId(course.thumbnail);
                await cloudinaryService.delete(publicId);
            } catch (err) {
                console.error("Failed to delete thumbnail:", err);
            }
        }

        await course.deleteOne();
        return course;
    },
}


export default courseService;

