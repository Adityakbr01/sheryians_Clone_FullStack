
import CourseWrapperDesk from '@/components/HomePageComponents/CourseWrapperDesk';
import CourseWrapperMobile from '@/components/HomePageComponents/CourseWrapperMobile';
import { courses } from '@/constants/footerData';
import { useGetCourses } from '@/hooks/TanStack/courseHooks';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';


function Section_3() {

    const { data, isLoading, error } = useGetCourses();
    const Apicourses = data?.data
    console.log(Apicourses)
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
                        {Apicourses?.map((Apicourses, idx) => (
                            <SwiperSlide key={idx} >
                                <CourseWrapperMobile course={Apicourses} idx={idx} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Grid for larger devices */}
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Apicourses?.map((course, idx) => (
                        <CourseWrapperDesk key={idx} course={course} idx={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Section_3;