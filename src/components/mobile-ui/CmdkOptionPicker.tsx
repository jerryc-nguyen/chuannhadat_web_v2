import { useMemo, useState } from 'react';
import { OptionForSelect } from '@common/models';
import { cn, stringToSlug } from '@common/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, Loader2 } from 'lucide-react';

export default function CmdkOptionPicker({
  options,
  value,
  searchable,
  onSelect,
  searchPlaceHolder,
  emptyMessage,
  filterable,
  isAjaxSearching,
  onSearchQueryChange
}: {
  options: Array<OptionForSelect>;
  value?: OptionForSelect;
  onSelect?: (option: OptionForSelect) => void;
  searchable?: boolean;
  searchPlaceHolder?: string;
  emptyMessage?: string;
  filterable?: boolean;
  isAjaxSearching?: boolean;
  onSearchQueryChange?: (term: string) => void
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
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      curValue?.text === listItem.text ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {listItem.text}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}

      </Command>
    </>
  );
}
