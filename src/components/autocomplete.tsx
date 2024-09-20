import { cn } from "@common/utils"
import { Command as CommandPrimitive } from "cmdk";
import { Check, CircleX, ChevronDown } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

type Props<T extends string> = {
  selectedValue: T;
  onSelectedValueChange: (arg0: { value: T; label: string } | null) => void;
  items: { value: T; label: string }[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  endAdornment?: ReactNode | null;
};

export function AutoComplete<T extends string>({
  selectedValue,
  onSelectedValueChange,
  items,
  isLoading,
  emptyMessage = "No items.",
  placeholder = "Search...",
  endAdornment,
  disabled
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [rerenderedTimes, setRerenderedTimes] = useState<number>(1);

  const onSelectItem = (inputValue: { value: T; label: string }) => {
    setSearchText(inputValue.label);
    onSelectedValueChange(inputValue);
    setOpen(false);
  };

  const [searchText, setSearchText] = useState<string>("");
  const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }

  useEffect(() => {
    if ( !disabled ) return;
    setSearchText("");
  }, [disabled])

  useEffect(() => {
    setRerenderedTimes(val => val+1)
  }, [searchText])

  const reset = () => {
    onSelectedValueChange(null);
    setSearchText("");
  };

  return (
    <div className="flex h-10 w-full rounded-md bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={selectedValue}
              onKeyDown={(e) => {
                setOpen(e.key !== "Escape")
              }}
              onMouseDown={() => {
                setOpen(true)
              }}
            >
              <Input
                value={searchText}
                placeholder={placeholder}
                onChange={onSearchTextChange}
                endAdornment={
                  endAdornment ||
                  (
                    searchText ?
                      <CircleX className="cursor-pointer" onClick={reset}/> :
                      <ChevronDown className="h-4 w-4 opacity-50"/>
                  )
                }
                disabled={disabled}
              />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            style={{zIndex: 99999}}
            sideOffset={15}
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase())).map((option, index) => (
                    <CommandItem
                      key={index * rerenderedTimes}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={() => onSelectItem(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandEmpty>{emptyMessage ?? "No items."}</CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}