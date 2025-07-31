import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button";
import type { FormFieldProps } from "./Field";
import Field from "./Field";
import type { FromMainProps } from "./Main";
import Main from "./Main";
import Wrapper, { type FormWrapperProps } from "./Wrapper";

export const Form = {
  Wrapper: (props: FormWrapperProps) => <Wrapper {...props} />,
  Title: ({ text, className }: { text: string; className: string }) => (
    <h2
      className={twMerge("mb-8 text-center text-2xl font-semibold", className)}
    >
      {text}
    </h2>
  ),
  Main: (props: FromMainProps) => <Main {...props} />,
  Field: (props: FormFieldProps) => <Field {...props} />,
  Submit: ({ className, ...props }: React.ComponentProps<typeof Button>) => (
    <Button
      className={twMerge(
        "bg-az3 text-am1 mt-2.5 w-full cursor-pointer rounded-xl border-0 p-3.5 text-base font-bold transition-all duration-200",
        className,
      )}
      {...props}
    />
  ),
};
