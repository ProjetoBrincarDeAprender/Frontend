import React from "react";
import { twMerge } from "tailwind-merge";

export type FormWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Wrapper({ children, className }: FormWrapperProps) {
  return (
    <div
      className={twMerge(
        className,
        "bg-am1 text-az3 font-1 w-full max-w-lg rounded-3xl p-10 shadow-md",
      )}
    >
      {children}
    </div>
  );
}
