"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  label?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="space-y-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="relative">
          <Input
            {...props}
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer text-muted-foreground"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }

