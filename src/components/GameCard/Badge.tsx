import { twJoin } from "tailwind-merge";

export type GameCardBadgeProps = {
  className?: string;
  name: string;
  textColor: string;
  bgColor: string;
};

export default function GameCardBadge({
  className,
  name,
  textColor,
  bgColor,
}: GameCardBadgeProps) {
  return (
    <div
      className={twJoin(
        "rounded-full px-5 py-1 text-sm text-nowrap shadow md:text-base",
        bgColor,
        className,
      )}
    >
      <p className={textColor}>{name}</p>
    </div>
  );
}
