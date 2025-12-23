import { useMemo, useState } from 'react';
import { OptionForSelect } from '@common/types';
import { cn, stringToSlug } from '@common/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, Clock, Loader2 } from 'lucide-react';

export default function CmdkOptionPicker({
  options,
  value,
  searchable,
  onSelect,
  searchPlaceHolder,
  emptyMessage,
  filterable,
  isAjaxSearching,
  onSearchQueryChange,
  showDescription = false,
}: {
  options: Array<OptionForSelect>;
  value?: OptionForSelect;
  onSelect?: (option: OptionForSelect) => void;
  searchable?: boolean;
  searchPlaceHolder?: string;
  emptyMessage?: string;
  filterable?: boolean;
  isAjaxSearching?: boolean;
  onSearchQueryChange?: (term: string) => void;
  showDescription?: boolean;
}) {
  const [curValue, setCurValue] = useState(value);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (filterable == false) {
      return options
    } else {
      return searchQuery
        ? options.filter((item: A) => stringToSlug(item.text).includes(stringToSlug(searchQuery)))
        : options;
    }
  }, [filterable, options, searchQuery])

  const onQueryChange = (search: string) => {
    setSearchQuery(search)
    if (onSearchQueryChange) {
      onSearchQueryChange(search)
    }
  }

  return (
    <>
      <Command
        filter={() => {
          return 1;
        }}
      >
        {searchable && (
          <CommandInput
            placeholder={searchPlaceHolder}
            value={searchQuery}
            onValueChange={onQueryChange}
          />
        )}

        {!!isAjaxSearching && (
          <CommandList>
            <CommandEmpty>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </CommandEmpty>
          </CommandList>
        )}

        {!isAjaxSearching && (
          <CommandList>
            <CommandEmpty>{emptyMessage || 'Không tìm thấy kết quả.'}</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((listItem: OptionForSelect) => (
                <CommandItem
                  key={listItem.value}
                  value={listItem.value + ''}
                  onSelect={() => {
                    setCurValue(listItem);
                    onSelect && onSelect(listItem);
                  }}
                >
                  {curValue?.value === listItem.value ? (
                    <Check className={cn('mr-2 h-4 w-4 opacity-100')} />
                  ) : (listItem as any).scope === 'recent' ? (
                    <Clock className={cn('mr-2 h-4 w-4 opacity-70')} />
                  ) : (
                    <Check className={cn('mr-2 h-4 w-4 opacity-0')} />
                  )}
                  <div className="flex flex-col">
                    <span>{listItem.text}</span>
                    {showDescription && (listItem as any).description && (
                      <span className="text-xs text-muted-foreground">
                        {(listItem as any).description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}

      </Command>
    </>
  );
}
