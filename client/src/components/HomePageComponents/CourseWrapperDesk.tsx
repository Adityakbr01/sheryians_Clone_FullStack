import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { Icourse } from '../pages/Section/Home/Section_3';


function CourseWrapperDesk({ course, idx }: { course: Icourse, idx: number }) {
    return (
        <div key={idx} className="course-wrapper px-3 mb-5">
            <Link href={course.link}>
                <Card className="flex flex-col py-0 bg-[#1a1a1a] border-none text-white min-h-[500px] max-h-[500px] w-full max-w-[400px] mx-auto">
                    <div className="relative w-full h-48">
                        <Image
                            src={course.image}
                            alt={`${course.title} thumbnail`}
                            fill
                            className="object-cover rounded-t-md"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <Badge className="absolute top-2 right-2 bg-[#fff] text-black text-xs font-HelveticaNow font-medium px-2 py-1 rounded">
                            {course.subTag}
                        </Badge>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                        <h2 className="font-NeuMachina text-lg md:text-2xl text-start mb-2">
                            {course.title}
                        </h2>
                        <div className="flex uppercase gap-2 text-sm font-HelveticaNow text-gray-300 mb-3">
                            {course.type && (
                                <span className="bg-[#882727] px-2 py-1 text-sm rounded">
                                    {course.type}
                                </span>
                            )}
                            {course.language && (
                                <span className="bg-[#2C2C2C] px-2 py-1 text-sm rounded">
                                    {course.language}
                                </span>
                            )}
                        </div>
                        <div className="mt-auto flex flex-col gap-2">
                            <div className="text-sm text-start font-HelveticaNow text-[#24cfa6]">
                                <span>{course.offer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg md:text-xl font-semibold font-HelveticaNow">
                                    {course.price} {course.gst || ""}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    {course.originalPrice}
                                </span>
                                <span className="text-sm text-[#24cfa6] font-medium">
                                    <Badge className="bg-white text-black">
                                        {course.discount}
                                    </Badge>
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
                <Button
                    className="bg-[#24cfa6] mt-3 block w-full max-w-[400px] mx-auto text-black text-center font-HelveticaNow font-medium py-2 rounded-md hover:bg-[#1bd1a6] transition-colors"
                >
                    View Details
                </Button>
            </Link>

        </div>
    )
}

export default CourseWrapperDesk