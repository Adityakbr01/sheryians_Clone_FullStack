"use client"
import Section_1 from "./Section/Home/Section_1"
import Section_2 from "./Section/Home/Section_2"

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
            <div className="w-full max-w-7xl h-full flex flex-col mx-auto text-center">
               <Section_1/>
               <Section_2/>
            </div>
        </div>
    )
}

export default HomePage
