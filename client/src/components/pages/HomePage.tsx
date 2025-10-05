"use client"
import Footer from "../layouts/footers/Footer"
import Section_04 from "./Section/Home/Section_04"
import Section_1 from "./Section/Home/Section_1"
import Section_2 from "./Section/Home/Section_2"
import Section_3 from "./Section/Home/Section_3"


function HomePage() {
    return (
        <div
            className="w-full"
            style={{
                backgroundImage: 'url("/images/bg_highlight.svg")',
                backgroundSize: "cover",
            }}
        >
            {/* Content wrapper */}
            <div className="w-full h-full flex flex-col text-center">
                <Section_1 />
                <Section_2 />
                <Section_3 />
                <Section_04 />
                <Footer />
            </div>
        </div>
    )
}

export default HomePage
