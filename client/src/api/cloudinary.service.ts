import api from '@/api/axios';

export interface CloudinaryUploadResponse {
    success: boolean;
    message: string;
    data: {
        url: string;
        publicId: string;
        originalname: string;
        mimetype: string;
        size: number;
    };
}

export const cloudinaryService = {
    /**
     * Upload a thumbnail image file to Cloudinary
     * @param file The file to upload
     * @returns Promise with the uploaded file details
     */
    uploadThumbnail: async (file: File): Promise<CloudinaryUploadResponse['data']> => {
        const formData = new FormData();
        formData.append('thumbnail', file);

        const response = await api.post<CloudinaryUploadResponse>('/cloudinary/thumbnail', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },

    /**
     * Upload a profile image file to Cloudinary
     * @param file The file to upload
     * @returns Promise with the uploaded file details
     */
    uploadProfileImage: async (file: File): Promise<CloudinaryUploadResponse['data']> => {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await api.post<CloudinaryUploadResponse>('/cloudinary/profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },

    /**
     * Upload a video file to Cloudinary
     * @param file The file to upload
     * @returns Promise with the uploaded file details
     */
    uploadVideo: async (file: File): Promise<CloudinaryUploadResponse['data']> => {
        const formData = new FormData();
        formData.append('video', file);

        const response = await api.post<CloudinaryUploadResponse>('/cloudinary/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },

    /**
     * Upload a PDF assignment to Cloudinary
     * @param file The file to upload
     * @returns Promise with the uploaded file details
     */
    uploadAssignment: async (file: File): Promise<CloudinaryUploadResponse['data']> => {
        const formData = new FormData();
        formData.append('assignment', file);

        const response = await api.post<CloudinaryUploadResponse>('/cloudinary/assignment', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },

    /**
     * Upload PDF course notes to Cloudinary
     * @param file The file to upload
     * @returns Promise with the uploaded file details
     */
    uploadNotes: async (file: File): Promise<CloudinaryUploadResponse['data']> => {
        const formData = new FormData();
        formData.append('notes', file);

        const response = await api.post<CloudinaryUploadResponse>('/cloudinary/notes', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },
};