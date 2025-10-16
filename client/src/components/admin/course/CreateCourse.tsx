"use client";

import { useCreateCourse, useUpdateCourse } from '@/hooks/TanStack/courseHooks';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Control, FieldErrors, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import toast from 'react-hot-toast';
import { categoryEnum, CourseLanguage, CourseStatusEnum, CourseType, CreateCourseFormValues, CreateCourseProps, createCourseSchema } from './course';
// Remove the direct import from types/course.ts to avoid duplicate enum definitions
import CreateCourseForm from './CreateCourseForm';


function CreateCourse({ isOpen, onOpenChange, editData }: CreateCourseProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const isEditMode = !!editData;

    //Tanstack
    const createCourseMutation = useCreateCourse();
    const updateCourseMutation = useUpdateCourse();

    // Using a type assertion to resolve the temporary type mismatch
    const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            title: "",
            description: "",
            originalPrice: 0,
            category: "",
            subTag: "",
            offer: "",
            gst: true,
            providesCertificate: true,
            CourseLanguage: CourseLanguage.HINGLISH,
            type: CourseType.LIVE,
            tags: [],
            discountPercentage: 0,
            thumbnail: null,
            CourseStatus: CourseStatusEnum.UPCOMING, // Changed from courseStatus to CourseStatus to match server model
        },
    }) as {
        control: Control<CreateCourseFormValues>;
        register: UseFormRegister<CreateCourseFormValues>;
        handleSubmit: UseFormHandleSubmit<CreateCourseFormValues>;
        formState: { errors: FieldErrors<CreateCourseFormValues> };
        reset: (values?: CreateCourseFormValues) => void;
        setValue: (name: keyof CreateCourseFormValues, value: unknown) => void;
    };

    // No need to watch tags anymore as we use Controller component

    // 🔥 Prefill form when editing
    useEffect(() => {
        if (editData && isOpen) { // 👈 Added isOpen to ensure modal is visible
            // Normalize category (as before, for mismatches)
            const rawCategory = editData.category?.trim() || "";
            const normalizedCategory = categoryEnum.find(
                (cat) => cat.toLowerCase() === rawCategory.toLowerCase()
            ) || rawCategory;

            const courseLanguage = editData.CourseLanguage as CourseLanguage || CourseLanguage.HINGLISH;
            const courseType = editData.type as CourseType || CourseType.LIVE;

            reset({
                title: editData.title,
                description: editData.description,
                originalPrice: editData.originalPrice,
                discountPercentage: editData.discountPercentage || 0,
                gst: editData.gst,
                category: normalizedCategory,
                tags: editData.tags || [],
                subTag: editData.subTag,
                offer: editData.offer,
                CourseLanguage: courseLanguage,
                type: courseType,
                providesCertificate: editData.providesCertificate ?? true, // Default to true if undefined
                thumbnail: null, // Add the missing property
                CourseStatus: (editData.CourseStatus as unknown as CourseStatusEnum) || CourseStatusEnum.UPCOMING
            });
            setPreview(editData.thumbnail || null);

            // Explicit setValue to ensure select values are properly set
            setTimeout(() => {
                setValue('category', normalizedCategory);
                setValue('CourseLanguage', courseLanguage); // Explicitly set CourseLanguage
                setValue('type', courseType);
                // Explicitly set CourseStatus to ensure it's visible in the form
                setValue('CourseStatus', (editData.CourseStatus as unknown as CourseStatusEnum) || CourseStatusEnum.UPCOMING);
            }, 0);
        }
    }, [editData, reset, setValue, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 👈 Optional: Validate here
            if (!file.type.startsWith('image/')) {
                toast.error('Only image files are allowed');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                toast.error('File too large (max 5MB)');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
            setThumbnailFile(file);
        } else {
            setPreview(null);
            setThumbnailFile(null);
        }
    };

    const onSubmit = async (data: CreateCourseFormValues) => {
        const formData = new FormData();

        // Basic fields
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('originalPrice', data.originalPrice.toString());
        formData.append('category', data.category);
        formData.append('subTag', data.subTag || '');
        formData.append('offer', data.offer || '');
        formData.append('gst', data.gst ? 'true' : 'false');
        formData.append('providesCertificate', data.providesCertificate ? 'true' : 'false');
        formData.append('discountPercentage', data.discountPercentage.toString());
        formData.append('CourseLanguage', data.CourseLanguage);
        formData.append('type', data.type);
        formData.append('CourseStatus', data.CourseStatus); // Using the correct field name to match server model

        // 🔥 Always send tags as JSON string
        formData.append('tags', JSON.stringify(data.tags || []));

        // Thumbnail
        if (thumbnailFile) {
            formData.append('thumbnail', thumbnailFile);
        }

        if (isEditMode && editData?._id) {
            // Edit mode
            formData.append('_id', editData._id);
            const result = await updateCourseMutation.mutateAsync(formData);
            toast.success(`"${result.data.title}" updated successfully!`);
        } else {
            // Create mode
            const result = await createCourseMutation.mutateAsync(formData);
            toast.success(`"${result.data.title}" created successfully!`);
        }

        // Reset form and preview
        onOpenChange(false);
        reset({
            title: "",
            description: "",
            originalPrice: 0,
            category: "",
            subTag: "",
            offer: "",
            gst: true,
            providesCertificate: true,
            CourseLanguage: CourseLanguage.HINGLISH,
            type: CourseType.LIVE,
            tags: [],
            discountPercentage: 0,
            thumbnail: null,
            CourseStatus: CourseStatusEnum.UPCOMING, // Ensure default is set
        });
        setPreview(null);
        setThumbnailFile(null);
    };

    return (
        <div
            className={clsx(
                "fixed inset-0 bg-black/10 p-8 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300",
                isOpen ? "opacity-100 visible z-[9999]" : "opacity-0 invisible"
            )}
        >
            <div className="bg-[#2C2C2C] text-white overflow-y-auto max-h-[80vh] md:w-[510px] w-[310px] p-4 rounded-sm relative">
                <div
                    className="absolute top-3 right-2 cursor-pointer"
                    onClick={() => onOpenChange(false)}
                >
                    <CircleX size={18} />
                </div>

                <main className="w-full h-full font-HelveticaNow">
                    <div className="text-center flex flex-col gap-2 mb-4">
                        <h2 className="text-xl font-medium">
                            {isEditMode ? "Edit Course" : "Create Course"}
                        </h2>
                        <p className="text-sm leading-5 font-medium">
                            {isEditMode
                                ? "Update the details of the course below."
                                : "Fill the form below to create a new course."}
                        </p>
                    </div>

                    <CreateCourseForm
                        onSubmit={onSubmit}
                        handleSubmit={handleSubmit}
                        register={register}
                        errors={errors}
                        control={control}
                        handleFileChange={handleFileChange}
                        preview={preview}
                        createCourseMutation={createCourseMutation}
                        updateCourseMutation={updateCourseMutation}
                        isEditMode={isEditMode}
                    />
                </main>
            </div>
        </div>
    )
}

export default CreateCourse;