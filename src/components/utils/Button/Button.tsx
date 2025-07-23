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
        className={`${className} button-${variant} flex items-center gap-1 px-3 py-1.5 rounded-2xl shadow-md font-1 font-medium`}
      >
        {children}
      </button>
    );
  } else if (size === "md") {
    return (
      <button
        className={`${className} button-${variant} flex items-center gap-2 px-4 py-2 rounded-2xl shadow-lg font-1 font-medium`}
      >
        {children}
      </button>
    );
  } else if (size === "lg") {
    return (
      <button
        className={`${className} button-${variant} flex items-center gap-3 px-6 py-3 rounded-3xl shadow-lg font-1 font-medium`}
      >
        {children}
      </button>
    );
  } else if (size === "1xl") {
    return (
      <button
        className={`${className} button-${variant} flex items-center gap-4 px-8 py-4 rounded-4xl shadow-lg font-1 font-medium text-2xl`}
      >
        {children}
      </button>
    );
  }
}
