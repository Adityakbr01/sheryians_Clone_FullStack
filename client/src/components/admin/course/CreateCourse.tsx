"use client";

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCreateCourse, useUpdateCourse } from '@/hooks/TanStack/courseHooks';
import { Course } from '@/types/course';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { CircleX, Loader } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form'; // 👈 Added useWatch
import toast from 'react-hot-toast';
import { categoryEnum, CourseLanguage, CourseType, createCourseSchema } from './course';
import { CreateCourseFormValues } from './types';

interface CreateCourseProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editData?: Course | null; // 👈 used for editing
}

function CreateCourse({ isOpen, onOpenChange, editData }: CreateCourseProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null); // 👈 Proper destructuring
    const isEditMode = !!editData;

    //Tanstack
    const createCourseMutation = useCreateCourse();
    const updateCourseMutation = useUpdateCourse();

    const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            CourseLanguage: CourseLanguage.HINGLISH,
            type: CourseType.LIVE,
            gst: true,
            providesCertificate: true,
            discountPercentage: 0, // 👈 Fixed: Use number, not string
            category: ""
        }
    });

    // 👈 Watch tags for display in edit mode
    const tagsWatch = useWatch({ control, name: 'tags' });

    // 🔥 Prefill form when editing
    useEffect(() => {
        if (editData && isOpen) { // 👈 Added isOpen to ensure modal is visible
            console.log("Editing course:", editData); // Keep for debug

            // Normalize category (as before, for mismatches)
            const rawCategory = editData.category?.trim() || "";
            const normalizedCategory = categoryEnum.find(
                (cat) => cat.toLowerCase() === rawCategory.toLowerCase()
            ) || rawCategory;

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
                CourseLanguage: editData.CourseLanguage as CourseLanguage || CourseLanguage.HINGLISH,
                type: editData.type as CourseType || CourseType.LIVE,
                providesCertificate: editData.providesCertificate
            });
            setPreview(editData.thumbnail || null);

            // 👈 Optional nudge: Explicit setValue after reset for Select sync
            setTimeout(() => {
                setValue('category', normalizedCategory);
                setValue('type', editData.type as CourseType || CourseType.LIVE);
            }, 0);
        }
    }, [editData, reset, setValue, isOpen]); // 👈 Added setValue and isOpen to deps

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
        reset();
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

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="space-y-1">
                            <Label
                                htmlFor="title"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Course Title
                            </Label>
                            <input
                                id="title"
                                placeholder="Enter course title"
                                type="text"
                                className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                                {...register('title')}
                            />
                            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="description"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Course Description
                            </Label>
                            <input
                                id="description"
                                placeholder="Enter course description"
                                type="text"
                                className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                                {...register('description')}
                            />
                            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="originalPrice"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Original Price
                            </Label>
                            <input
                                id="originalPrice"
                                placeholder="Enter original price"
                                type="number"
                                className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                                {...register('originalPrice', { valueAsNumber: true })}
                            />
                            {errors.originalPrice && <p className="text-xs text-red-500">{errors.originalPrice.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="discountPercentage"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Discount Percentage
                            </Label>

                            <Controller
                                name="discountPercentage"
                                control={control}
                                defaultValue={0}
                                render={({ field }) => (
                                    <input
                                        id="discountPercentage"
                                        placeholder="Enter discount percentage"
                                        type="number"
                                        min={0}
                                        max={95}
                                        className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                                        {...field}
                                        value={field.value as number} // cast to number
                                        onChange={(e) => field.onChange(Number(e.target.value))} // ensure number type
                                    />
                                )}
                            />
                            {errors.discountPercentage && (
                                <p className="text-xs text-red-500">{errors.discountPercentage.message}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="gst"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                GST Aplicable?
                            </Label>
                            <Controller
                                name="gst"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="gst"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="border-[#3c3c3c] outline-none font-light placeholder:text-[12px]"
                                    />
                                )}
                            />
                            {errors.gst && <p className="text-xs text-red-500">{errors.gst.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="category"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Category
                            </Label>

                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field} // 👈 Spread for full RHF sync
                                        value={field.value || ""}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="border-b py-[0.30rem] w-full rounded-sm border-none outline-none bg-[#1e1e1e] px-4 font-light text-[12px]">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>

                                        <SelectContent position="popper" className="z-[10000]">
                                            {categoryEnum.map((category, index) => (
                                                <SelectItem key={index} value={category}> {/* 👈 Always use category as value */}
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="tags"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Tags
                            </Label>
                            <input
                                id="tags"
                                placeholder="Enter tags (separated by commas)"
                                type="text"
                                value={tagsWatch ? (Array.isArray(tagsWatch) ? tagsWatch.join(', ') : tagsWatch) : ''} // 👈 Display joined in edit
                                {...register("tags", {
                                    setValueAs: (val) =>
                                        typeof val === "string"
                                            ? val
                                                .split(",")
                                                .map((t) => t.trim())
                                                .filter(Boolean)
                                            : [],
                                })}
                                className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                            />
                            {errors.tags && <p className="text-xs text-red-500">{errors.tags.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="subTag"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                subTag
                            </Label>
                            <input
                                id="subTag"
                                placeholder="Enter subTag (i.g, Job Ready)"
                                type="text"
                                className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                                {...register('subTag')}
                            />
                            {errors.subTag && <p className="text-xs text-red-500">{errors.subTag.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="offer"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                offer
                            </Label>
                            <input
                                id="offer"
                                placeholder="Enter offer (i.g, Limited Time Discount)"
                                type="text"
                                className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
                                {...register('offer')}
                            />
                            {errors.offer && <p className="text-xs text-red-500">{errors.offer.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="thumbnail"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Add Course Thumbnail
                            </Label>

                            {/* 👈 Wrapped in Controller for consistency (optional validation) */}
                            <Controller
                                name="thumbnail"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange} // No RHF sync needed
                                        className="w-full text-sm text-white file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-sm file:border-none cursor-pointer"
                                    />
                                )}
                            />

                            {preview && (
                                <div className="mt-2 relative w-full h-40">
                                    <Image
                                        src={preview}
                                        alt="Thumbnail Preview"
                                        fill
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            )}

                            {errors.thumbnail && <p className="text-xs text-red-500">{errors.thumbnail.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="CourseLanguage"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Course Language
                            </Label>

                            <Controller
                                name="CourseLanguage"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field} // 👈 Spread for sync
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="border-b py-[0.30rem] w-full rounded-sm border-none outline-none bg-[#1e1e1e] px-4 font-light text-[12px]">
                                            <SelectValue placeholder="Select a Course Language" />
                                        </SelectTrigger>

                                        <SelectContent position="popper" className="z-[10000]">
                                            {Object.values(CourseLanguage).map((lang, index) => (
                                                <SelectItem key={index} value={lang}>
                                                    {lang}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.CourseLanguage && <p className="text-xs text-red-500">{errors.CourseLanguage.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="CourseType"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Course Type
                            </Label>

                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field} // 👈 Spread for sync
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="border-b py-[0.30rem] w-full rounded-sm border-none outline-none bg-[#1e1e1e] px-4 font-light text-[12px]">
                                            <SelectValue placeholder="Select a Course Type" />
                                        </SelectTrigger>

                                        <SelectContent position="popper" className="z-[10000]">
                                            {Object.values(CourseType).map((type, index) => (
                                                <SelectItem key={index} value={type}> {/* 👈 Fixed: Always use type as value, no override */}
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="providesCertificate"
                                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
                            >
                                Provides Certificate?
                            </Label>
                            <Controller
                                name="providesCertificate"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="providesCertificate"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="border-[#3c3c3c] outline-none font-light placeholder:text-[12px]"
                                    />
                                )}
                            />
                            {errors.providesCertificate && <p className="text-xs text-red-500">{errors.providesCertificate.message}</p>}
                        </div>
                        <Button
                            type="submit"
                            className="bg-blue-600 flex items-center justify-center hover:bg-blue-700 text-white py-2 px-4 rounded-sm mt-2"
                        >
                            {(createCourseMutation.isPending || updateCourseMutation.isPending) ? (
                                <Loader className='animate-spin h-4 w-4' />
                            ) : isEditMode ? 'Update Course' : 'Create Course'}
                        </Button>
                    </form>
                </main>
            </div>
        </div>
    )
}

export default CreateCourse;