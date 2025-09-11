
import CourseWrapperDesk from '@/components/HomePage/CourseWrapperDesk';
import CourseWrapperMobile from '@/components/HomePage/CourseWrapperMobile';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

const courses = [
    {
        title: "2.0 Job Ready AI Powered Cohort: Web + DSA + Aptitude",
        link: "/courses/courses-details/2.0 Job Ready AI Powered Cohort: Web + DSA + Aptitude",
        subTag: "Job Ready",
        image: "https://ik.imagekit.io/sheryians/cohort-3_ekZjBiRzc.jpeg",
        language: "Hinglish",
        type: "Live Batch",
        offer: "Early Bird Discount",
        price: "₹ 5999",
        gst: "+ GST",
        originalPrice: "₹ 11999",
        discount: "50% OFF"
    },
    {
        title: "DSA Domination Cohort",
        link: "/courses/courses-details/DSA Domination Cohort",
        subTag: "Logic Building",
        image: "https://ik.imagekit.io/sheryians/courses_gif/undefined-web-dsa-thumb-10_ZKtPNgmW_.webp_Zhu2w1to5h.jpeg",
        language: "Hinglish",
        type: "Live Batch",
        offer: "Limited Time Discount",
        price: "₹ 6600",
        gst: "+ GST",
        originalPrice: "₹ 7500",
        discount: "12% OFF"
    },
    {
        title: "Job Ready AI Powered Cohort: Web + DSA + Aptitude",
        link: "/courses/courses-details/Job Ready AI Powered Cohort: Web + DSA + Aptitude",
        subTag: "Job Ready",
        image: "https://ik.imagekit.io/sheryians/courses_gif/undefined-IMG_5100_7vO7pODI9.JPG",
        language: "Hinglish",
        type: "Live Batch",
        offer: "Limited Time Discount",
        price: "₹ 5999",
        gst: "+ GST",
        originalPrice: "₹ 11999",
        discount: "50% OFF"
    },
    {
        title: "Three.js Domination",
        link: "/courses/courses-details/Three.js Domination",
        subTag: "ANIMATION",
        image: "https://ik.imagekit.io/sheryians/courses_gif/undefined-maxresdefault_5-AHh9_1Y.jpg",
        language: "Hindi",
        type: "Live Batch",
        offer: "Limited time discount",
        price: "₹ 2499",
        originalPrice: "₹ 3500",
        discount: "29% OFF"
    },
    {
        title: "Java & DSA Domination",
        link: "/courses/courses-details/Java & DSA Domination",
        subTag: "INDEPTH",
        image: "https://ik.imagekit.io/sheryians/courses_gif/undefined-javaas_Large_jY0Wighav__6PygWBZQ.jpeg",
        language: "Hinglish",
        type: "Live Batch",
        offer: "Limited Time Discount",
        price: "₹ 4999",
        originalPrice: "₹ 9999",
        discount: "50% OFF"
    },
    {
        title: "Aptitude & Reasoning for Campus Placements",
        link: "/courses/courses-details/Aptitude & Reasoning for Campus Placements",
        subTag: "Placements",
        image: "https://ik.imagekit.io/sheryians/courses_gif/undefined-apti_reasoning_45vyAnZ4y.jpeg",
        language: "Hinglish",
        type: "Live Batch",
        offer: "Limited Time Discount",
        price: "₹ 1100",
        originalPrice: "₹ 1999",
        discount: "55% OFF"
    },
    {
        title: "Front-End Domination: Create Anything with Code",
        link: "/courses/courses-details/Front-End Domination: Create Anything with Code",
        subTag: "INDEPTH",
        image: "https://ik.imagekit.io/sheryians/courses_gif/Front-End_Domination__Create_Anything_with_Code-FRONTENDTHUBNAIL_Wf8WqcNJx.jpg",
        language: "Hindi",
        type: "Live Batch",
        offer: "Limited Time Discount",
        price: "₹ 3999",
        originalPrice: "₹ 9999",
        discount: "40% OFF"
    }
];

function Section_3() {
    return (
        <div className="flex flex-col h-full w-full text-white py-12 px-4">
            <div className="top mb-8">
                <h1 className="font-NeuMachina text-start text-3xl sm:text-4xl md:text-5xl">
                    <span>Courses Offered.</span>
                </h1>
            </div>
            <div className="bottom">
                {/* Mobile Slider (below 640px) */}
                <div className="block sm:hidden">
                    <Swiper
                        className="courses w-full"
                        slidesPerView={1}
                        spaceBetween={1}
                        pagination={{ clickable: true }}
                    >
                        {courses.map((course, idx) => (
                            <SwiperSlide key={idx}>
                              <CourseWrapperMobile course={course} idx={idx}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                {/* Grid for larger devices (640px and above) */}
                <div className="hidden  courses sm:grid grid-cols-2 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                    {courses.map((course, idx) => (
                      <CourseWrapperDesk course={course} idx={idx}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Section_3;