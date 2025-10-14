import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Controller } from 'react-hook-form';
import { categoryEnum, CourseLanguage, CourseType, CreateCourseFormProps } from './course';
import { useState, useEffect } from 'react';




// Custom component for tags input that properly handles commas
function TagsInput({ value, onChange, onBlur }: {
    value: string[],
    onChange: (value: string[]) => void,
    onBlur?: () => void
}) {
    // State to hold the input text (comma-separated string)
    const [inputText, setInputText] = useState(() => {
        // Initialize from value array if available
        return Array.isArray(value) && value.length > 0 ? value.join(', ') : '';
    });

    // Update input text ONLY when the form value changes externally
    // But NOT when we're typing (which would cause the cursor to jump)
    useEffect(() => {
        if (Array.isArray(value) && !document.activeElement?.id?.includes('tags-input')) {
            const newText = value.join(', ');
            if (inputText !== newText) {
                setInputText(newText);
            }
        }
    }, [value, inputText]);

    return (
        <input
            id="tags-input"
            placeholder="Enter tags (separated by commas)"
            type="text"
            value={inputText}
            onChange={(e) => {
                // Always update the local input text immediately
                const currentText = e.target.value;
                setInputText(currentText);

                // Only when we have actual content, update the form field value
                if (currentText.trim()) {
                    // Convert to array but keep the input text as-is
                    const tagsArray = currentText
                        .split(',')
                        .map(tag => tag.trim())
                        .filter(Boolean);

                    onChange(tagsArray);
                } else {
                    // Empty input means empty array
                    onChange([]);
                }
            }}
            onBlur={onBlur}
            className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
        />
    );
}

function CreateCourseForm({ onSubmit, handleSubmit, register, errors, control, handleFileChange, preview, createCourseMutation, updateCourseMutation, isEditMode }: CreateCourseFormProps) {
    return (
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
                <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                        <TagsInput
                            value={Array.isArray(field.value) ? field.value : []}
                            onChange={(newTags) => {
                                // Make sure we always pass an array to field.onChange
                                field.onChange(newTags || []);
                            }}
                            onBlur={field.onBlur}
                        />
                    )}
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
                    render={({ field }) => (
                        <input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                handleFileChange(e);
                                // Also update the form field value for consistency
                                field.onChange(e.target.files?.[0] || null);
                            }}
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
                    <Loader2 className='animate-spin h-4 w-4' />
                ) : isEditMode ? 'Update Course' : 'Create Course'}
            </Button>
        </form>
    )
}

export default CreateCourseForm