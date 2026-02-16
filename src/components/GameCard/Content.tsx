import { twJoin } from "tailwind-merge";

export type GameCardContentProps = {
  className?: string;
  title: string;
  description: string;
};

export default function GameCardContent({
  className,
  title,
  description,
}: GameCardContentProps) {
  return (
    <div className={twJoin("font-1", className)}>
      <h2 className="text-xl font-bold text-neutral-900 md:text-4xl">
        {title}
      </h2>
      <p className="text-justify text-neutral-800 md:text-lg">{description}</p>
    </div>
  );
}
