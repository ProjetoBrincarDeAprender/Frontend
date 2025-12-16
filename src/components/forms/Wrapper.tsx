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
        "bg-am1 text-az3 font-1 flex h-full w-full flex-col rounded-3xl p-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
