
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';


function CourseWrapperMobile({ course, idx }: { course: any, idx: any }) {
    return (
        <div className="course-wrapper px-2">
            <Card className="flex flex-col py-0 bg-[#1a1a1a] border-none text-white min-h-[500px] max-h-[500px] w-full max-w-[400px] mx-auto">
                <div className="relative w-full h-48">
                    <Image
                        src={course.image}
                        alt={`${course.title} thumbnail`}
                        fill
                        className="object-cover rounded-t-md"
                        sizes="100vw"
                    />
                    <span className="absolute top-2 right-2 bg-[#fff] text-black text-xs font-HelveticaNow font-medium px-2 py-1 rounded">
                        {course.subTag}
                    </span>
                </div>
                <div className="flex flex-col flex-1 p-3 sm:p-4">
                    {/* Title */}
                    <h2 className="font-NeuMachina text-base sm:text-lg md:text-xl lg:text-2xl text-start line-clamp-2 mb-2">
                        {course.title}
                    </h2>

                    {/* Type + Language badges */}
                    <div className="flex uppercase flex-wrap gap-2 text-xs sm:text-sm font-HelveticaNow text-gray-300 mb-3">
                        {course.type && (
                            <span className="bg-[#882727] px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                                {course.type}
                            </span>
                        )}
                        {course.language && (
                            <span className="bg-[#2C2C2C] px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                                {course.language}
                            </span>
                        )}
                    </div>

                    {/* Price + Offer Section */}
                    <div className="mt-auto flex flex-col gap-2">
                        <div className="text-xs sm:text-sm text-start font-HelveticaNow text-[#24cfa6]">
                            <span>{course.offer}</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base sm:text-lg md:text-xl font-semibold font-HelveticaNow">
                                {course.price} {course.gst || ""}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                                {course.originalPrice}
                            </span>
                            <span className="text-xs sm:text-sm text-[#24cfa6] font-medium">
                                <Badge className="bg-white text-black">{course.discount}</Badge>
                            </span>
                        </div>
                    </div>
                </div>

            </Card>
            <Link
                href={course.link}
                className="mt-4 block w-full bg-[#24cfa6] text-black text-center font-HelveticaNow font-medium py-2 rounded-md hover:bg-[#1bd1a6] transition-colors"
            >
                View Details
            </Link>
        </div>
    )
}

export default CourseWrapperMobile