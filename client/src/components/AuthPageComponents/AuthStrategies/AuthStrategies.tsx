"use client"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import GoogleStrategie from "../GoogleStrategie"

function AuthStrategies({ isSignupPage }: { isSignupPage: boolean }) {
  return (
    <div className="strategies flex flex-col gap-3 w-full max-w-[400px]">
      <GoogleStrategie />

      {/* New User */}
      <Link
        href={"/signup/newUser"}
        className={`flex items-center justify-center gap-2 border border-[#3c3c3c] rounded-full py-2 cursor-pointer transition ${!!isSignupPage && "hidden"
          }`}
      >
        <UserPlus size={20} />
        <span className="md:text-xl font-medium">Create a new User</span>
      </Link>
    </div>
  )
}

export default AuthStrategies
