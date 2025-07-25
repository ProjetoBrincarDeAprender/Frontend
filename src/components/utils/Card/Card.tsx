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
      className={`card-${variant} z-2 max-w-80 p-2 font-2 font-medium text-center m-auto flex flex-col gap-6 rounded-4xl shadow-2xl`}
    >
      <header className="rounded-3xl overflow-hidden">
        <img src={image} alt="game logo" />
      </header>
      <main className="flex flex-col gap-4 py-4">
        <h1 className="text-3xl">{title}</h1>
        <a
          href={
            variant === "game" ? `games/${gameIdUrl}` : `skills/${gameIdUrl}`
          }
          className="m-auto px-4 py-2 rounded-xl transition mb-8"
        >
          Jogar
        </a>
      </main>
    </div>
  );
}
