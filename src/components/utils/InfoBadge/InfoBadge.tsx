import { FiUser, FiHome } from "react-icons/fi";
import { PiGraduationCapLight } from "react-icons/pi";

interface InfoBadgeProps {
  variant: "blue" | "yellow" | "red";
  label: string;
  value: string | number;
}

const variantStyles = {
  blue: {
    bg: "bg-blue-400",
    circle: "bg-blue-600",
    icon: <PiGraduationCapLight className="w-6 h-6 text-white opacity-90" />,
    border: "border-blue-200",
  },
  yellow: {
    bg: "bg-yellow-300",
    circle: "bg-orange-400",
    icon: <FiUser className="w-6 h-6 text-white opacity-90" />,
    border: "border-yellow-100",
  },
  red: {
    bg: "bg-rose-400",
    circle: "bg-red-600",
    icon: <FiHome className="w-6 h-6 text-white opacity-90" />,
    border: "border-rose-200",
  },
};

export function InfoBadge({ variant, label, value }: InfoBadgeProps) {
  const style = variantStyles[variant];
  return (
    <div
      className={`relative flex items-center rounded-full shadow-md ${style.bg}`}
      style={{ width: 240, height: 80 }}
    >
      {/* Círculo decorativo à direita */}
      <span
        className={`absolute top-0 right-0 rounded-full ${style.circle} opacity-100 pointer-events-none`}
        style={{ width: "50%", height: "100%" }}
      />

      {/* Contorno branco interno */}
      <span className="absolute inset-0 m-1.5 rounded-full border border-white opacity-80 z-10 pointer-events-none" />

      {/* Conteúdo */}
      <div className="relative z-20 flex items-center justify-between w-full h-full px-4 gap-3">
        {/* Ícone dentro de círculo branco */}
        <span className="flex items-center justify-center h-10 aspect-square rounded-full border border-white">
          {style.icon}
        </span>

        {/* Texto e valor */}
        <div className="flex flex-col justify-center text-white font-semibold text-sm leading-tight w-full">
          <span className="uppercase tracking-wide text-left w-full">
            {label}
          </span>
          <span className="text-lg font-bold tracking-widest text-center w-full">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
