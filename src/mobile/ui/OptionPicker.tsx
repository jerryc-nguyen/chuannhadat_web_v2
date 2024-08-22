import { Searchbar } from 'konsta/react';
import ListCheckOptions from './ListCheckOptions';
import { useMemo, useState } from 'react';
import { stringToSlug } from '@utils/string';
import { IoFileTrayOutline } from 'react-icons/io5';
import { OptionForSelect } from 'src/types';

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

  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value);
  };
  const handleClear = () => {
    setSearchQuery('');
  };

  const filteredItems = searchQuery
    ? options.filter((item: any) =>
        stringToSlug(item.text).includes(stringToSlug(searchQuery))
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
        <div className='c-optionPicker__search bg-white py-3 px-2'>
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
        <div className='flex items-center flex-col mt-4'>
          <IoFileTrayOutline color='rgb(156 163 175)' size={25} />
          <p className='text-gray'>
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
