import { useState } from 'react';
import { OptionForSelect } from '@models';
import { cn, stringToSlug } from '@common/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { LuCheck } from 'react-icons/lu';

export default function CmdkOptionPicker({
  options,
  value,
  searchable,
  onSelect,
  searchPlaceHolder,
  emptyMessage,
}: {
  options: Array<OptionForSelect>;
  value?: OptionForSelect;
  onSelect?: (option: OptionForSelect) => void;
  searchable?: boolean;
  searchPlaceHolder?: string;
  emptyMessage?: string;
}) {
  const [curValue, setCurValue] = useState(value);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = searchQuery
    ? options.filter((item: A) => stringToSlug(item.text).includes(stringToSlug(searchQuery)))
    : options;

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
            onValueChange={setSearchQuery}
          />
        )}
        <CommandList>
          <CommandEmpty>{emptyMessage || 'Không tìm thấy kết quả.'}</CommandEmpty>
          <CommandGroup>
            {filteredItems.map((listItem: OptionForSelect) => (
              <CommandItem
                key={listItem.value}
                value={listItem.value.toString()}
                onSelect={(currentValue) => {
                  setCurValue(listItem);
                  onSelect && onSelect(listItem);
                }}
              >
                <LuCheck
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
      </Command>
    </>
  );
}
