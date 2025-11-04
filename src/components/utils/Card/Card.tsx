import "./Card.css";
import defaultImage from "../../../assets/cardplaceholder.svg";

export interface CardProps {
  title: string;
  gameIdUrl?: string;
  image?: string;
  variant?: "game" | "skill" | "future";
}

export function Card({
  gameIdUrl,
  title,
  image = defaultImage,
  variant = "game",
}: CardProps) {
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
          href={
            variant === "game" || variant === "future"
              ? `/games/${gameIdUrl}`
              : `skills/${gameIdUrl}`
          }
          className="m-auto mb-8 rounded-xl px-4 py-2 transition"
        >
          {variant === "future" ? "Em breve" : "Jogar"}
        </a>
      </main>
    </div>
  );
}
