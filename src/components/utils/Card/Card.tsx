import "./Card.css";
import defaultImage from "../../../assets/cardplaceholder.svg";

export interface CardProps {
  title: string;
  gameIdUrl?: string;
  image?: string;
  variant?: "game" | "skill" | "future";
  disabled?: boolean;
}

export function Card({
  gameIdUrl,
  title,
  image = defaultImage,
  variant = "game",
  disabled = false,
}: CardProps) {
  const linkHref = disabled
    ? undefined
    : variant === "game" || variant === "future"
      ? `/games/${gameIdUrl}`
      : `skills/${gameIdUrl}`;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className={`card-${variant} font-2 z-2 m-auto flex h-96 w-64 flex-col rounded-4xl p-2 text-center font-medium shadow-2xl`}
    >
      <header className="h-1/2 w-full overflow-hidden rounded-3xl">
        <img
          src={image}
          alt="game logo"
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </header>
      <main className="flex h-1/2 flex-col justify-between gap-4 py-4">
        <h1 className="text-3xl">{title}</h1>
        <a
          href={linkHref}
          onClick={handleClick}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={`m-auto mb-8 rounded-xl px-4 py-2 transition ${disabled ? "pointer-events-auto cursor-not-allowed opacity-60" : ""}`}
        >
          {disabled === true ? "Em breve" : "Jogar"}
        </a>
      </main>
    </div>
  );
}
