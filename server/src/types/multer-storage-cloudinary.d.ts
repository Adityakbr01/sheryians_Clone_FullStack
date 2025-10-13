// Custom type definitions for multer-storage-cloudinary
declare module 'multer-storage-cloudinary' {
    import { StorageEngine } from 'multer';
    import { v2 as cloudinary } from 'cloudinary';

    interface CloudinaryStorageOptions {
        cloudinary: typeof cloudinary;
        params: {
            folder?: string;
            format?: string;
            allowed_formats?: string[];
            transformation?: unknown;
            filename?: (req: Express.Request, file: Express.Multer.File) => string;
            resource_type?: 'auto' | 'image' | 'video' | 'raw';
            public_id?: string | ((req: Express.Request, file: Express.Multer.File) => string);
        };
    }

    export class CloudinaryStorage implements StorageEngine {
        constructor(options: CloudinaryStorageOptions);
        _handleFile(req: Express.Request, file: Express.Multer.File, callback: (error?: any, info?: any) => void): void;
        _removeFile(req: Express.Request, file: Express.Multer.File, callback: (error?: any) => void): void;
    }
}