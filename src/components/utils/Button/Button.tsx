import "./Button.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "light" | "dark" | "warning";
  size?: "lg" | "md" | "sm" | "1xl";
  className?: string;
  onClick?: () => void;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  if (size === "sm") {
    return (
      <button
        className={`${className} button-${variant} font-1 flex items-center gap-1 rounded-2xl px-3 py-1.5 font-medium shadow-md`}
      >
        {children}
      </button>
    );
  } else if (size === "md") {
    return (
      <button
        className={`${className} button-${variant} font-1 flex items-center gap-2 rounded-2xl px-4 py-2 font-medium shadow-lg`}
      >
        {children}
      </button>
    );
  } else if (size === "lg") {
    return (
      <button
        className={`${className} button-${variant} font-1 flex items-center gap-3 rounded-3xl px-6 py-3 font-medium shadow-lg`}
      >
        {children}
      </button>
    );
  } else if (size === "1xl") {
    return (
      <button
        className={`${className} button-${variant} font-1 flex items-center gap-4 rounded-4xl px-8 py-4 text-2xl font-medium shadow-lg`}
      >
        {children}
      </button>
    );
  }
}
