"use client"
import React from "react"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { UserPlus } from "lucide-react"

function AuthStrategies() {
  return (
    <div className="strategies flex flex-col gap-3 w-full max-w-[400px]">
      {/* Google */}
      <button className="flex items-center justify-center gap-2 border border-[#3c3c3c] rounded-full py-2 cursor-pointer transition">
        <FcGoogle size={20} />
        <span className="text-xl font-medium">Continue with Google</span>
      </button>

      {/* New User */}
      <Link
        href={"/signup/newUser"}
        className="flex items-center justify-center gap-2 border border-[#3c3c3c] rounded-full py-2 cursor-pointer transition"
      >
        <UserPlus size={20} />
        <span className="text-xl font-medium">Create a new User</span>
      </Link>
    </div>
  )
}

export default AuthStrategies
