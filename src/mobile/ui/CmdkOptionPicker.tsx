import ListCheckOptions from './ListCheckOptions';
import { useMemo, useState } from 'react';
import { IoFileTrayOutline } from 'react-icons/io5';
import { OptionForSelect } from '@models';
import { cn, stringToSlug } from '@common/utils';
import SearchBox from '@components/SearchBox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  const [curValue, setValue] = useState(value)
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: A) => {
    setSearchQuery(e.target.value);
  };
  const handleClear = () => {
    setSearchQuery('');
  };

  const filteredItems = searchQuery
    ? options.filter((item: A) => stringToSlug(item.text).includes(stringToSlug(searchQuery)))
    : options;

  const isEmptyList = useMemo((): boolean => {
    return (
      (filteredItems[0]?.value == 'all' && filteredItems.length === 1) || filteredItems.length === 0
    );
  }, [filteredItems]);

  return (
    <>
      <Command>
        <CommandInput placeholder="Search listItem..." />
        <CommandList>
          <CommandEmpty>No listItem found.</CommandEmpty>
          <CommandGroup>
            {options.map((listItem) => (
              <CommandItem
                key={listItem.value}
                value={listItem.value.toString()}
                onSelect={(currentValue) => {
                  console.log('currentValue', currentValue);
                }}
              >
                <LuCheck
                  className={cn(
                    "mr-2 h-4 w-4",
                    value?.text === listItem.text ? "opacity-100" : "opacity-0"
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
