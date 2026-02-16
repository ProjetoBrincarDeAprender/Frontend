import { twMerge } from "tailwind-merge";

export type GameCardButtonProps = {
  className?: string;
  text: string;
  onClick?: () => void;
};

export default function GameCardButton({
  className,
  text,
  onClick,
}: GameCardButtonProps) {
  return (
    <button
      className={twMerge(
        "font-1 bg-az0 hover:bg-az4 rounded-lg px-2 py-1 text-lg font-bold md:mt-auto md:w-fit md:place-self-center md:rounded-xl md:px-8 md:text-3xl",
        className,
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
