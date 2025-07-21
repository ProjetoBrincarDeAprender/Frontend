import "./Link.css";

interface LinkProps {
  variant?: "primary" | "light" | "dark";
  children: React.ReactNode;
  href: string;
  className?: string;
}

export function Link({
  children,
  variant = "primary",
  href,
  className = "",
}: LinkProps) {
  return (
    <a href={href} className={`link-${variant} ${className}`}>
      {children}
    </a>
  );
}
