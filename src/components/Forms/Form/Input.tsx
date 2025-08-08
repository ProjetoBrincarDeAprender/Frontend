import { Input as ShadcnInput } from "@/components/ui/input";
import React from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

export type FormInputProps = {
  wrapperClassName?: string;
  labelClassName?: string;
  label: string;
  inputDescription?: string;
  autofocus?: boolean;
} & React.ComponentProps<typeof ShadcnInput>;

export default function Input({
  wrapperClassName,
  labelClassName,
  label,
  inputDescription,
  autoFocus,
  ...props
}: FormInputProps) {
  return (
    <FormItem className={wrapperClassName}>
      <FormLabel className={labelClassName}>{label}</FormLabel>
      <FormControl autoFocus={autoFocus}>
        <ShadcnInput {...props} />
      </FormControl>
      {inputDescription && (
        <FormDescription>{inputDescription}</FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
