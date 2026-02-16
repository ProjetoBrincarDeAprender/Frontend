import { twMerge } from "tailwind-merge";

export type GameCardWrapperProps = {
  className?: string;
  children: React.ReactNode;
};

export function GameCardWrapper({ className, children }: GameCardWrapperProps) {
  return (
    <div
      className={twMerge(
        "mx-auto flex w-4/5 flex-col gap-2 rounded-lg bg-neutral-100 p-3 shadow-lg md:grid md:max-h-93 md:w-2/3 md:grid-cols-2 md:gap-6 md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
