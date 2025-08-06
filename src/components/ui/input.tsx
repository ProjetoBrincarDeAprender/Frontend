import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-13 w-full rounded-lg bg-amber-50 px-6 py-2 text-base text-gray-800 bg-transparent",
          "border border-purplish-blue",                           
          "placeholder:text-gray-500",                         
          "transition-colors ease-in-out duration-200",         
          "hover:border-purplish-blue",                            
          "focus-visible:outline-none focus-visible:ring-2", 
          "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
