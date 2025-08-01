import type { UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { Form, FormMessage } from "../ui/form";

export type FromMainProps = {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  className?: string;
  children?: React.ReactNode;
};

export default function Main({
  form,
  onSubmit,
  children,
  className,
}: FromMainProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={twMerge("w-full", className)}
      >
        {form.formState.errors.root && (
          <FormMessage>{form.formState.errors.root.message}</FormMessage>
        )}
        {children}
      </form>
    </Form>
  );
}
