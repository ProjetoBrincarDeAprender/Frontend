import "./Link.css";

interface LinkProps {
  variant?: "primary" | "light" | "dark";
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
    <a href={href} target={target} className={`link-${variant} ${className}`}>
      {children}
    </a>
  );
}
