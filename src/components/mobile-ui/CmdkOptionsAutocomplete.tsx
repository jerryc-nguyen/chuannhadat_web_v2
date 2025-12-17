import { cn } from '@common/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@components/ui/popover';
import { Skeleton } from '@components/ui/skeleton';
import { OptionForSelect } from '@common/types';
import { Input } from '@components/ui/input';

type Props<T extends OptionForSelect> = {
  keyword?: string;
  onSelectedValueChange: (value: T) => void;
  items: OptionForSelect[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
};

export function CmdkOptionsAutocomplete<T extends OptionForSelect>({
  keyword,
  onSelectedValueChange,
  items,
  isLoading,
  emptyMessage = 'No items.',
  onSearch,
  placeholder,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState(keyword || '');
  const onSelectItem = (inputValue: T) => {
    onSelectedValueChange(inputValue);
    setOpen(false);
  };

  return (
    <div className="flex h-10 w-full rounded-md bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <div className="w-full">
              <CommandPrimitive.Input
                asChild
                onValueChange={onSearch}
                onKeyDown={(e) => {
                  setOpen(e.key !== 'Escape');
                }}
                onMouseDown={() => {
                  if (currentKeyword) setOpen((open) => !!currentKeyword || !open);
                }}
              >
                <Input
                  value={currentKeyword}
                  placeholder={placeholder || "Nhập giá bán"}
                  onChange={(e) => {
                    setCurrentKeyword(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                />
              </CommandPrimitive.Input>
            </div>
          </PopoverAnchor>

          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            sideOffset={5}
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (e.target instanceof Element && e.target.hasAttribute('cmdk-input')) {
                e.preventDefault();
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0 left-[-3px]"
            align="start" side="bottom"
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
                  {items.map((option) => (
                    <CommandItem
                      key={option.text}
                      value={option.text}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={() => onSelectItem(option as T)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          currentKeyword === option.text ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {option.text}

                      <CommandShortcut>{option.description}</CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? <CommandEmpty>{emptyMessage ?? 'No items.'}</CommandEmpty> : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
