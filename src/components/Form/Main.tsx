import { twMerge } from "tailwind-merge";
import { Form } from "../ui/form";

export type FromMainProps = {
  form: any;
  onSubmit: (values: any) => any;
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
        {children}
      </form>
    </Form>
  );
}
