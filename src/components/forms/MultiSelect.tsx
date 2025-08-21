import { X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type SelectItems = { value: string; label: string };

export type MultiSelectProps = {
  data: SelectItems[];
  preSelectedData?: SelectItems[];
  onSelect: (ids: number[] | string[]) => void;
};

export function FancyMultiSelect({
  data,
  preSelectedData,
  onSelect,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SelectItems[]>(
    preSelectedData ? preSelectedData : [],
  );
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = React.useCallback(
    (item: SelectItems) => {
      setSelected((prev) => {
        const newSelected = [...prev, item];
        onSelect(newSelected.map(({ value }) => value));
        return newSelected;
      });
    },
    [onSelect],
  );

  const handleUnselect = React.useCallback(
    (item: SelectItems) => {
      setSelected((prev) => {
        const newSelected = prev.filter((s) => s.value !== item.value);
        onSelect(newSelected.map(({ value }) => value));
        return newSelected;
      });
    },
    [onSelect],
  );

  const selectables = data.filter(
    (item) => !selected.some((s) => s.value === item.value),
  );

  return (
    <Command className="overflow-visible bg-transparent w-full">
      <div
        className="
          flex min-h-[52px] w-full flex-wrap items-center gap-2 rounded-lg px-6 py-2 text-base text-gray-800 bg-transparent
          border border-purplish-blue
          placeholder:text-gray-500
          transition-colors ease-in-out duration-200
          hover:border-purplish-blue
          focus-within:outline-none focus-within:ring-2
          disabled:cursor-not-allowed disabled:opacity-50"
              
      >
          {selected.map((data) => {
            return (
              <Badge key={data.value} variant="secondary">
                {data.label}
                <button
                  className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(data);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(data)}
                >
                  <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Selecione os alunos..."
            className="flex-1 bg-transparent outline-none placeholder:text-gray-500 text-gray-800"
            />
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((data) => {
                  return (
                    <CommandItem
                      key={data.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        handleSelect(data);
                      }}
                      className={"cursor-pointer"}
                    >
                      {data.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
