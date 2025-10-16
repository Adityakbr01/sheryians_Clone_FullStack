import { cloudinaryService } from "@/services/cloudinary.service";
import { createCourseSchema } from "@/validators/course";
import { Request, Response, NextFunction } from "express";
import fs from "fs";

export const prepareCourseBody = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const userId = req?.user?.id;

        // ✅ Boolean conversion
        if (typeof body.gst === "string") {
            body.gst = body.gst === "true";
        }

        if (typeof body.providesCertificate === "string") {
            body.providesCertificate = body.providesCertificate === "true";
        }

        // ✅ Array conversion for tags
        if (typeof body.tags === "string") {
            try {
                // Agar JSON string form me aaya hai
                body.tags = JSON.parse(body.tags);
            } catch {
                // Agar multiple tags as separate form-data fields me aaye
                body.tags = Array.isArray(body.tags) ? body.tags : [body.tags];
            }
        }
        // ✅ Thumbnail file upload to cloudinary
        if (req.file) {
            const result = await cloudinaryService.upload(req.file.path, "courses/thumbnails");
            body.thumbnail = result.secure_url;

            // Delete temp file
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }

        // ✅ Set instructor
        body.instructor = userId;

        // Assign back to req.body
        req.body = body;
        const parsed = createCourseSchema.parse(req.body);
        req.body = parsed;

        next();
    } catch (err) {
        next(err);
    }
};
