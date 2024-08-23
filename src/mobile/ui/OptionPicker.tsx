import { Searchbar } from 'konsta/react';
import ListCheckOptions from './ListCheckOptions';
import { useMemo, useState } from 'react';
import { IoFileTrayOutline } from 'react-icons/io5';
import { OptionForSelect } from '@models';
import { stringToSlug } from '@common/utils';

export default function OptionPicker({
  options,
  value,
  searchable,
  onSelect,
  searchPlaceHolder,
  emptyMessage,
}: {
  options: Array<OptionForSelect>;
  value?: OptionForSelect;
  onSelect: (option: OptionForSelect) => void;
  searchable?: boolean;
  searchPlaceHolder?: string;
  emptyMessage?: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: A) => {
    setSearchQuery(e.target.value);
  };
  const handleClear = () => {
    setSearchQuery('');
  };

  const filteredItems = searchQuery
    ? options.filter((item: A) =>
        stringToSlug(item.text).includes(
          stringToSlug(searchQuery),
        ),
      )
    : options;

  const isEmptyList = useMemo((): boolean => {
    return (
      (filteredItems[0]?.value == 'all' &&
        filteredItems.length === 1) ||
      filteredItems.length === 0
    );
  }, [filteredItems]);

  return (
    <>
      {searchable && (
        <div className="c-optionPicker__search bg-white px-2 py-3">
          <Searchbar
            inputStyle={{ borderRadius: '30px' }}
            placeholder={searchPlaceHolder ?? 'Tìm kiếm'}
            onInput={handleSearch}
            value={searchQuery}
            onClear={handleClear}
          />
        </div>
      )}

      {isEmptyList ? (
        <div className="mt-4 flex flex-col items-center">
          <IoFileTrayOutline
            color="rgb(156 163 175)"
            size={25}
          />
          <p className="text-gray">
            {' '}
            {emptyMessage ?? 'Không tìm thấy'}
          </p>
        </div>
      ) : (
        <ListCheckOptions
          options={filteredItems}
          selectedOption={value}
          onSelect={(option: OptionForSelect) => {
            onSelect(option);
          }}
        ></ListCheckOptions>
      )}
    </>
  );
}
