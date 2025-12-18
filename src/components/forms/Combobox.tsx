import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormItem, FormLabel } from "../ui/form";

export type FormComboboxProps = {
  label: string;
  labelClassName?: string;
  noItemFoundMessage?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  wrapperClassName?: string;
  variant?:
    | "default"
    | "link"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  value?: string;
  onChange?: (value: string) => void;
};

export default function Combobox({
  label,
  labelClassName,
  noItemFoundMessage,
  options,
  placeholder,
  variant,
  wrapperClassName,
  value: controlledValue,
  onChange,
}: FormComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  return (
    <FormItem className={wrapperClassName}>
      <FormLabel className={labelClassName}>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="border-1 border-gray-800" asChild>
          <Button
            variant={variant || "outline"}
            role="combobox"
            aria-expanded={open}
            className="w-100% justify-between"
            disabled={!options || options.length === 0}
          >
            {value
              ? options?.find((option) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-100% p-0">
          <Command>
            <CommandInput placeholder={placeholder} className="h-9" />
            <CommandList>
              <CommandEmpty>
                {noItemFoundMessage || "Nenhum item encontrado."}
              </CommandEmpty>
              <CommandGroup>
                {options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={(currentLabel) => {
                      const selected = options.find(
                        (opt) => opt.label === currentLabel,
                      );
                      const newValue = selected ? selected.value : "";
                      if (onChange) {
                        onChange(newValue);
                      } else {
                        setInternalValue(newValue);
                      }
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}
