import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from "../ui/select";

export type FormSelectProps = {
  wrapperClassName?: string;
  labelClassName?: string;
  label: string;
  autofocus?: boolean;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
} & React.ComponentProps<typeof ShadcnSelect>;

export default function Select({
  wrapperClassName,
  labelClassName,
  label,
  autofocus,
  options,
  onChange,
  defaultValue,
  placeholder,
  ...props
}: FormSelectProps) {
  return (
    <FormItem className={wrapperClassName}>
      <FormLabel className={labelClassName}>{label}</FormLabel>
      <FormControl autoFocus={autofocus}>
        <ShadcnSelect
          defaultValue={defaultValue}
          onValueChange={onChange}
          {...props}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="z-50"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadcnSelect>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
