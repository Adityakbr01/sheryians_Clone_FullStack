import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});



export const cloudinaryService = {
    upload: async (filePath: string, folder: string) => {
        return await cloudinary.uploader.upload(filePath, {
            folder,
        });
    },
    delete: async (publicId: string) => {
        return await cloudinary.uploader.destroy(publicId);
    },
};



// Helper to extract publicId from Cloudinary URL
export function extractCloudinaryPublicId(url: string) {
    // e.g. https://res.cloudinary.com/demo/image/upload/v123456/courses/thumbnails/abc.jpg
    const parts = url.split("/");
    const fileName = parts.pop() as string; // abc.jpg
    const folder = parts.slice(-2).join("/"); // courses/thumbnails
    const publicId = `${folder}/${fileName.split(".")[0]}`;
    return publicId;
}