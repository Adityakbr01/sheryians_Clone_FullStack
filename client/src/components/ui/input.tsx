import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-b py-[0.30rem] w-full rounded-sm border-[#3c3c3c] outline-none bg-[#1e1e1e] px-4 font-light placeholder:text-[12px] text-[#e9e9e9]",
        "",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Input }
