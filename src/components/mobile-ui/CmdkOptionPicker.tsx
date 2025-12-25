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
import { Check, Clock, Loader2, X } from 'lucide-react';

export default function CmdkOptionPicker({
  options,
  value,
  searchable,
  onSelect,
  onDelete,
  searchPlaceHolder,
  emptyMessage,
  filterable,
  isAjaxSearching,
  onSearchQueryChange,
  showDescription = false,
  disableHeight = false,
}: {
  options: Array<OptionForSelect>;
  value?: OptionForSelect;
  onSelect?: (option: OptionForSelect) => void;
  onDelete?: (option: OptionForSelect) => void;
  searchable?: boolean;
  searchPlaceHolder?: string;
  emptyMessage?: string;
  filterable?: boolean;
  isAjaxSearching?: boolean;
  onSearchQueryChange?: (term: string) => void;
  showDescription?: boolean;
  disableHeight?: boolean;
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
            <CommandEmpty className="text-sm text-gray-500 flex items-center p-4 justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </CommandEmpty>
          </CommandList>
        )}

        {!isAjaxSearching && (
          <CommandList className={cn(disableHeight && 'max-h-none overflow-visible')}>
            <CommandEmpty className="text-sm text-gray-500 flex items-center p-4">{emptyMessage || 'Không tìm thấy kết quả.'}</CommandEmpty>
            {!isAjaxSearching && searchQuery.length == 0 && filteredItems.length > 0 && (
              <h3 className="text-sm text-gray-500 flex items-center pl-2 py-2">
                Tìm kiếm gần đây:
              </h3>
            )}
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
                    <Clock className={cn('mr-2 h-4 w-4 opacity-70 text-muted-foreground')} />
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
                  {(listItem as any).scope === 'recent' && onDelete && (
                    <div
                      role="button"
                      className="ml-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(listItem);
                      }}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}

      </Command>
    </>
  );
}
