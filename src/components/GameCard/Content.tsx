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
      <h2 className="text-xl font-bold text-neutral-900 md:text-3xl lg:text-4xl">
        {title}
      </h2>
      <p className="md:text-md text-justify text-neutral-800 lg:text-lg">
        {description}
      </p>
    </div>
  );
}
