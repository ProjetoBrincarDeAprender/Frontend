import "./Card.css";
import defaultImage from "../../../assets/cardplaceholder.svg";

export interface CardProps {
  title: string;
  gameIdUrl: string;
  image?: string;
  variant?: "game" | "skill";
}

export function Card({
  gameIdUrl,
  title,
  image = defaultImage,
  variant = "game",
}: CardProps) {
  return (
    <div
      className={`card-${variant} font-2 z-2 m-auto flex max-w-80 flex-col gap-6 rounded-4xl p-2 text-center font-medium shadow-2xl`}
    >
      <header className="overflow-hidden rounded-3xl">
        <img src={image} alt="game logo" />
      </header>
      <main className="flex flex-col gap-4 py-4">
        <h1 className="text-3xl">{title}</h1>
        <a
          href={
            variant === "game" ? `/games/${gameIdUrl}` : `skills/${gameIdUrl}`
          }
          className="m-auto mb-8 rounded-xl px-4 py-2 transition"
        >
          Jogar
        </a>
      </main>
    </div>
  );
}
