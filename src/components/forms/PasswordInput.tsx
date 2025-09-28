import { Input as ShadcnInput } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export type FormPasswordInputProps = {
  wrapperClassName?: string;
  labelClassName?: string;
  label: string;
  inputDescription?: string;
  autofocus?: boolean;
} & React.ComponentProps<typeof ShadcnInput>;

export default function PasswordInput({
  wrapperClassName,
  labelClassName,
  label,
  inputDescription,
  autoFocus,
  ...props
}: FormPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormItem className={wrapperClassName}>
      <FormLabel className={labelClassName}>{label}</FormLabel>
      <FormControl autoFocus={autoFocus}>
        <div className="relative w-full">
          <ShadcnInput {...props} type={showPassword ? "text" : "password"} />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-0 right-3 bottom-0 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </FormControl>
      {inputDescription && (
        <FormDescription>{inputDescription}</FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
