interface CalmItemProps {
  title: string;
  variant: "music" | "breathing";
  onClick?: () => void;
}

export function CalmItem({ title, variant, onClick }: CalmItemProps) {
  return (
    <button
      className={`${variant === "music" ? "bg-blue-400" : "bg-yellow-300"} flex h-20 w-full items-center rounded-xl px-6 text-lg font-semibold shadow-md transition-colors duration-200 hover:scale-[1.02] hover:shadow-lg`}
      onClick={onClick}
      type="button"
    >
      {title}
    </button>
  );
}
