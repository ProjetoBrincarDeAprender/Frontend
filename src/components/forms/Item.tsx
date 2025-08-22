import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

export type FormItemProps = {
  children?: React.ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
  label?: string;
  autofocus?: boolean;
};

export default function Item({
  children,
  wrapperClassName,
  labelClassName,
  label,
  autofocus,
}: FormItemProps) {
  return (
    <FormItem className={wrapperClassName}>
      <FormLabel className={labelClassName}>{label}</FormLabel>
      <FormControl autoFocus={autofocus}>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
