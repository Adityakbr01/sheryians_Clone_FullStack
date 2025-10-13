"use client"

import CourseWrapperDesk from '@/components/HomePageComponents/CourseWrapperDesk';
import CourseWrapperMobile from '@/components/HomePageComponents/CourseWrapperMobile';
import Footer from '@/components/layouts/footers/Footer';
import { useGetCourses } from '@/hooks/TanStack/courseHooks';
import { ArrowDown } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Skeleton } from '@/components/ui/skeleton';
import Head from 'next/head';

const skeletonCount = 8;

function Page() {
    const { data, isLoading } = useGetCourses();
    const courses = data?.data || [];

    return (
        <>
            <Head>
                <title>My New Page Title</title>
                <meta name="description" content="This is my page description" />
            </Head>
            <main className='pt-16 md:pt-9 h-full w-full px-4 md:px-12 text-[var(--custom-textColor)]'>
                <div className="top md:mt-24 mt-16 md:pt-9"></div>

                <div className="middle py-14 flex text-center md:text-start flex-col md:gap-12 gap-4 font-NeuMachina">
                    <h2 className='text-5xl md:text-7xl md:leading-20'>
                        We&apos;re not a <span className='text-[var(--custom-primary)]'>course <br /> factory.</span>
                    </h2>
                    <p className='text-sm md:text-4xl'>We focus on courses that really help.</p>
                </div>

                <div className="bottom w-full">
                    {/* Mobile Slider */}
                    <h3 className='md:text-2xl text-center md:text-start w-full font-NeuMachina mb-8 flex items-center justify-center md:justify-start gap-4'>
                        Courses which do work <ArrowDown />
                    </h3>

                    <div className="block sm:hidden">
                        <Swiper
                            className="courses w-full"
                            slidesPerView={1.05}
                            spaceBetween={1}
                            pagination={{ clickable: true }}
                        >
                            {isLoading
                                ? Array.from({ length: skeletonCount }).map((_, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="px-3 mb-5 w-full max-w-[400px] mx-auto space-y-2 bg-[var(--custom-inputColor)]">
                                            <Skeleton className="h-48 w-full rounded-t-md animate-pulse bg-[var(--custom-inputColor)]" />
                                            <Skeleton className="h-6 w-3/4 animate-pulse bg-[var(--custom-inputColor)]" />
                                            <Skeleton className="h-4 w-1/2 animate-pulse bg-[var(--custom-inputColor)]" />
                                            <Skeleton className="h-6 w-full animate-pulse bg-[var(--custom-inputColor)]" />
                                            <Skeleton className="h-8 w-full animate-pulse mt-4 bg-[var(--custom-inputColor)]" />
                                        </div>
                                    </SwiperSlide>
                                ))
                                : courses.map((course, idx) => (
                                    <SwiperSlide key={idx}>
                                        <CourseWrapperMobile course={course} idx={idx} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>

                    {/* Grid for larger devices */}
                    <div className="hidden sm:grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {isLoading
                            ? Array.from({ length: skeletonCount }).map((_, idx) => (
                                <div key={idx} className="px-3 mb-5">
                                    <div className="w-full max-w-[400px] mx-auto space-y-2">
                                        <Skeleton className="h-48 w-full rounded-t-md animate-pulse bg-[var(--custom-inputColor)]" />
                                        <Skeleton className="h-6 w-3/4 animate-pulse bg-[var(--custom-inputColor)]" />
                                        <Skeleton className="h-4 w-1/2 animate-pulse bg-[var(--custom-inputColor)]" />
                                        <Skeleton className="h-6 w-full animate-pulse bg-[var(--custom-inputColor)]" />
                                        <Skeleton className="h-8 w-full animate-pulse mt-4 bg-[var(--custom-inputColor)]" />
                                    </div>
                                </div>
                            ))
                            : courses.map((course, idx) => (
                                <CourseWrapperDesk key={idx} course={course} idx={idx} />
                            ))
                        }
                    </div>
                </div>

                <Footer />
            </main>
        </>
    );
}

export default Page;
