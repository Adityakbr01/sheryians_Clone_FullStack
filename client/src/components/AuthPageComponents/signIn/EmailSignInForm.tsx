"use client"
import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useLogin } from "@/hooks/TanStack/mutations/useLogin"
import { useRouter } from "next/navigation"

// Zod schema
const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

function EmailSignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const loginMutation = useLogin();
  const router = useRouter();

  const handleSubmit = async () => {
    const result = emailSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await loginMutation.mutateAsync({ email, password });
      router.push("/"); // Or your post-login page
    } catch (error) {
      // Error is handled in mutation's onError
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Email Field */}
      <div className="space-y-1">
        <Label
          htmlFor="email"
          className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
        >
          Email address
        </Label>
        <input
          id="email"
          placeholder="Enter your email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px]"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Password Field */}
      <div className="space-y-1 relative">
        <Label
          htmlFor="password"
          className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
        >
          Password
        </Label>
        <input
          id="password"
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 pr-10 font-light placeholder:text-[12px]"
        />
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-[65%] transform cursor-pointer -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          disabled={loading}
          onClick={handleSubmit}
          className="text-[12px] px-3 py-1 h-fit w-fit rounded-full border border-[#3c3c3c] bg-[var(--custom-primary)] hover:bg-[var(--custom-primary)] cursor-pointer text-black"
        >
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Continue"}
        </Button>
      </div>
    </div>
  )
}

export default EmailSignInForm
