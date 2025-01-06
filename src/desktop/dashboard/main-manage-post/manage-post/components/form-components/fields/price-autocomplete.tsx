import { cn } from '@common/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import { ReactNode, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@components/ui/command';
import { Input } from '@components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@components/ui/popover';
import { Skeleton } from '@components/ui/skeleton';
import { OptionForSelect } from '@models';

type Props<T extends string> = {
  selectedValue: T;
  onSelectedValueChange: (value: string) => void;
  customItems?: OptionForSelect[];
  items: OptionForSelect[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  InputRender?: ReactNode;
  onCompleted?: () => void;
};

export function PriceAutoComplete<T extends string>({
  selectedValue,
  onSelectedValueChange,
  items,
  isLoading,
  emptyMessage = 'No items.',
  placeholder = 'Search...',
  InputRender,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  const onSelectItem = (inputValue: string) => {
    onSelectedValueChange(inputValue as T);
    setOpen(false);
  };

  const [searchText, setSearchText] = useState<string>('');
  const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="flex h-10 w-full rounded-md bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={selectedValue}
              onValueChange={onSelectedValueChange}
              onKeyDown={(e) => {
                setOpen(e.key !== 'Escape');
              }}
              onMouseDown={() => {
                if (selectedValue) setOpen((open) => !!selectedValue || !open);
              }}
            >
              {InputRender || (
                <Input value={searchText} placeholder={placeholder} onChange={onSearchTextChange} />
              )}
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            sideOffset={15}
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (e.target instanceof Element && e.target.hasAttribute('cmdk-input')) {
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
                  {items.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value as string}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedValue === option.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {option.text}
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

export function PriceAutoCompleteListView<T extends string>({
  selectedValue,
  onSelectedValueChange,
  items,
  isLoading,
  emptyMessage = 'No items.',
  placeholder = 'Search...',
  InputRender,
  onCompleted,
}: Props<T>) {
  const onSelectItem = (inputValue: string) => {
    onSelectedValueChange(inputValue as T);
    onCompleted && onCompleted();
  };

  const [searchText, setSearchText] = useState<string>('');
  const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const isShowSelectList = items.length > 0 && !isLoading && selectedValue !== 'Thỏa thuận';
  const showEmptyMessage = !isLoading && selectedValue !== 'Thỏa thuận';

  return (
    <div className="flex w-full rounded-md text-sm">
      <Command shouldFilter={false}>
        <div>
          <CommandPrimitive.Input
            asChild
            value={selectedValue}
            onValueChange={onSelectedValueChange}
          >
            {InputRender || (
              <Input value={searchText} placeholder={placeholder} onChange={onSearchTextChange} />
            )}
          </CommandPrimitive.Input>
        </div>
        <CommandList>
          {isLoading && (
            <CommandPrimitive.Loading>
              <div className="p-1">
                <Skeleton className="h-6 w-full" />
              </div>
            </CommandPrimitive.Loading>
          )}
          {isShowSelectList ? (
            <CommandGroup>
              {items.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value as string}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={onSelectItem}
                  className="justify-between flex w-full"
                >
                  <div>{option.text}</div>
                  <div>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValue === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {showEmptyMessage ? <CommandEmpty>{emptyMessage ?? 'No items.'}</CommandEmpty> : null}
        </CommandList>
      </Command>
    </div>
  );
}
