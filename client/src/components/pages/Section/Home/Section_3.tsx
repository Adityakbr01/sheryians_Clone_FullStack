
import CourseWrapperDesk from '@/components/HomePageComponents/CourseWrapperDesk';
import CourseWrapperMobile from '@/components/HomePageComponents/CourseWrapperMobile';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCourses } from '@/hooks/TanStack/courseHooks';
import { Course } from '@/types/course';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';



function Section_3() {
    const skeletonCount = 8

    const { data, isLoading } = useGetCourses();
    const courses = data?.data || []
    return (
        <div className="flex flex-col w-full text-white pt-12 px-4">
            <div className="top mb-8">
                <h1 className="font-NeuMachina text-start text-3xl sm:text-4xl md:text-5xl">
                    <span>Courses Offered.</span>
                </h1>
            </div>

            <div className="bottom">
                {/* Mobile Slider */}
                <div className="block sm:hidden">
                    <Swiper
                        className="courses w-full"
                        slidesPerView={1.05}
                        spaceBetween={1}
                        pagination={{ clickable: true }}
                    >
                        {courses?.map((course, idx) => (
                            <SwiperSlide key={idx} >
                                <CourseWrapperMobile course={course} idx={idx} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Grid for larger devices */}
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        isLoading
                            ? Array.from({ length: skeletonCount }).map((_, idx) => (
                                <div key={idx} className="px-3 mb-5" >
                                    <div className="w-full max-w-[400px] mx-auto" >
                                        <Skeleton className="h-48 w-full rounded-t-md mb-3 bg-[var(--custom-inputColor)]" />
                                        <Skeleton className="h-6 w-3/4 mb-2 bg-[var(--custom-inputColor)]" />
                                        <Skeleton className="h-4 w-1/2 mb-2 bg-[var(--custom-inputColor)]" />
                                        <Skeleton className="h-6 w-full bg-[var(--custom-inputColor)]" />
                                        <Skeleton className="h-8 mt-6 w-full bg-[var(--custom-inputColor)]" />
                                    </div>
                                </div>
                            ))
                            : courses?.map((course: Course, idx: number) => (
                                <CourseWrapperDesk key={idx} course={course} idx={idx} />
                            ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Section_3;