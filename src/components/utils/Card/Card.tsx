import "./Card.css";
import defaultImage from "../../../assets/cardplaceholder.svg";

export interface CardProps {
  title: string;
  gameIdUrl?: string;
  image?: string;
  variant?: "game" | "skill" | "future";
  disabled?: boolean;
  competency?: string;
  knowledgeArea?: string;
}

export function Card({
  gameIdUrl,
  title,
  image = defaultImage,
  variant = "game",
  disabled = false,
  competency,
  knowledgeArea,
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
      className={`card-${variant} font-2 z-2 m-auto flex h-auto min-h-[280px] w-full max-w-[16rem] flex-col rounded-4xl text-center font-medium shadow-2xl sm:min-h-[24rem]`}
    >
      <header className="aspect-square w-full overflow-hidden rounded-3xl sm:aspect-auto sm:h-1/2">
        <img
          src={image}
          alt="game logo"
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </header>
      <main className="flex flex-1 flex-col justify-start gap-2 py-3 sm:py-4">
        <h1 className="text-lg font-bold sm:text-2xl">{title}</h1>
        {competency && (
          <div className="px-2 text-left">
            <p className="mb-0.5 text-xs font-semibold text-gray-600">
              Competência:
            </p>
            <p className="line-clamp-2 text-xs text-gray-700">{competency}</p>
          </div>
        )}
        {knowledgeArea && !competency && (
          <div className="px-2">
            <p className="text-sm font-semibold text-gray-600">
              Área: {knowledgeArea}
            </p>
          </div>
        )}
        <a
          href={linkHref}
          onClick={handleClick}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={`mx-auto mt-auto mb-3 rounded-xl px-4 py-1.5 text-sm transition sm:mb-4 sm:py-2 sm:text-base ${disabled ? "pointer-events-auto cursor-not-allowed opacity-60" : ""}`}
        >
          {disabled === true ? "Em breve" : "Jogar"}
        </a>
      </main>
    </div>
  );
}
