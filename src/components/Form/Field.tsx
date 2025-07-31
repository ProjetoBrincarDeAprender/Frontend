import React from "react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { FormField } from "../ui/form";

export type FormFieldProps = {
  form: UseFormReturn;
  children: React.ReactNode;
  name: string;
  render: (props: { field: ControllerRenderProps }) => React.ReactElement;
} & React.ComponentProps<typeof FormField>;

export default function Field({
  form,
  name,
  render,
  ...props
}: FormFieldProps) {
  return (
    <FormField control={form.control} name={name} render={render} {...props} />
  );
}
