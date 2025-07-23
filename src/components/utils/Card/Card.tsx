import "./Card.css";
import defaultImage from "../../../assets/cardplaceholder.svg";

interface CardProps {
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
      className={`card-${variant} max-w-96 p-2 font-2 font-medium text-center m-auto flex flex-col gap-6 rounded-4xl`}
    >
      <header className="rounded-3xl overflow-hidden">
        <img src={image} alt="game logo" />
      </header>
      <main className="flex flex-col gap-4 py-4">
        <h1 className="text-3xl">{title}</h1>
        <a
          href={`games/${gameIdUrl}`}
          className="m-auto px-4 py-2 rounded-xl transition"
        >
          Jogar
        </a>
      </main>
    </div>
  );
}
