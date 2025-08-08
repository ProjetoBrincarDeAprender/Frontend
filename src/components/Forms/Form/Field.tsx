import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField } from "../../ui/form";

export type FormFieldProps = {
  form: UseFormReturn<any>;
  name: string;
} & React.ComponentProps<typeof FormField>;

export default function Field({ form, name, ...props }: FormFieldProps) {
  return <FormField control={form.control} name={name} {...props} />;
}
