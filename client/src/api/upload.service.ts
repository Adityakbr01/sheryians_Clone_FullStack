import api from '@/api/axios';

export interface UploadResponse {
    success: boolean;
    message: string;
    data: {
        url: string;
    };
}

export const uploadService = {
    /**
     * Upload a thumbnail image file
     * @param file The file to upload
     * @returns Promise with the uploaded file URL
     */
    uploadThumbnail: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('thumbnail', file);

        const response = await api.post<UploadResponse>('/uploads/thumbnail', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data.url;
    },
};