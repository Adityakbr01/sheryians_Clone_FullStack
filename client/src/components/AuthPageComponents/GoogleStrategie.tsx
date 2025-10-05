import React from 'react'
import { FcGoogle } from 'react-icons/fc'

function GoogleStrategie() {
    return (
        <button className="flex items-center justify-center gap-2 border border-[#3c3c3c] rounded-full py-2 cursor-pointer transition">
            <FcGoogle size={20} />
            <span className="md:text-xl font-medium">Continue with Google</span>
        </button>
    )
}
export default GoogleStrategie