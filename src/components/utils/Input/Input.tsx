import React from "react";
import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: "primary" | "light" | "dark";
  inputSize?: "sm" | "md" | "lg";
  className?: string;
  error?: string;
}

const sizeClasses = {
  sm: "px-3 py-2 text-sm rounded-lg",
  md: "px-4 py-2 text-base rounded-xl",
  lg: "px-5 py-3 text-lg rounded-2xl",
};

const variantText = {
  primary:
    "text-slate-900 border border-yellow-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200",
  light:
    "text-slate-900 border border-slate-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100",
  dark: "text-yellow-100 border border-slate-800 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-900",
};

const variantBg = {
  primary: { background: "var(--color-yellow)" },
  light: { background: "#f9fafb" },
  dark: { background: "#232323" },
};

export function Input({
  label,
  variant = "primary",
  inputSize = "md",
  className = "",
  error,
  ...props
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1 max-w-xs ${className}`}>
      {label && (
        <label className="text-slate-300 font-medium text-base mb-0.5 select-none">
          {label}
        </label>
      )}
      <input
        style={variantBg[variant]}
        className={`transition-all duration-200 outline-none shadow-sm w-full ${
          variantText[variant]
        } ${sizeClasses[inputSize]} ${
          error ? "border-red-500 ring-2 ring-red-200" : ""
        }`}
        {...props}
      />
      <span className="min-h-[1.2em] text-red-500 text-xs font-medium mt-0.5">
        {error || ""}
      </span>
    </div>
  );
}
