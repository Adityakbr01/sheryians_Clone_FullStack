import Link from 'next/link'
import React from 'react'
import { FaLock } from 'react-icons/fa'

function Unauthorized() {
    return (
        <div
            className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-10 text-white"
            style={{
                backgroundImage: 'url("/images/bg_highlight.svg")',
                backgroundSize: "cover",
            }}
        >
            <div className="flex flex-col items-center max-w-xl mx-auto text-center gap-6">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[var(--custom-primary)] rounded-full flex items-center justify-center mb-4 animate-shake-with-pause">
                    <FaLock className="text-black text-3xl md:text-4xl" />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold font-NeuMachina">
                    <span className="text-[var(--custom-primary)]">Access</span> Denied
                </h1>

                <p className="text-lg md:text-xl text-[var(--custom-textColor)] font-HelveticaNow mt-2">
                    You don&apos;t have permission to view this page. Please contact an administrator
                    or return to the homepage.
                </p>

                <div className="mt-8">
                    <Link href="/">
                        <button className="px-6 py-3 md:px-8 md:py-4 font-HelveticaNow text-black bg-[var(--custom-primary)] hover:bg-[#1bd1a6]/90 transition-all text-base md:text-lg font-medium rounded-md">
                            Return to Homepage
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized