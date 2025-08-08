import { Link as ReactLink } from "react-router";
import { twMerge } from "tailwind-merge";
import "./Link.css";

interface LinkProps {
  variant?: "primary" | "light" | "dark" | "secondary" | "none";
  children: React.ReactNode;
  href: string;
  className?: string;
  target?: string;
}

export function Link({
  children,
  variant = "primary",
  href,
  className = "",
  target = "",
}: LinkProps) {
  return (
    <ReactLink
      to={href}
      target={target}
      className={
        variant === "none" ? className : twMerge(`link-${variant}`, className)
      }
    >
      {children}
    </ReactLink>
  );
}
