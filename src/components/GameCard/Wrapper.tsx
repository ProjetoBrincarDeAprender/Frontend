import { twMerge } from "tailwind-merge";

export type GameCardWrapperProps = {
  className?: string;
  children: React.ReactNode;
  id?: string;
};

export function GameCardWrapper({
  className,
  children,
  id,
}: GameCardWrapperProps) {
  return (
    <div
      className={twMerge(
        "mx-auto flex w-4/5 scroll-mt-32 flex-col gap-2 rounded-lg bg-neutral-100 p-3 shadow-lg md:grid md:w-3/4 md:grid-cols-2 md:gap-6 md:p-8 lg:max-h-93 lg:w-2/3",
        className,
      )}
      id={id}
    >
      {children}
    </div>
  );
}
