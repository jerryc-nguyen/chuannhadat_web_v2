import { Searchbar, Toolbar } from 'konsta/react';
import ListCheckOptions from '../filter_bds/bts/ListCheckOptions';

export interface OptionProps {
  id?: string | number;
  text?: string;
}

export default function OptionPicker({
  options,
  value,
  searchable,
  onSelect,
}: {
  options: Array<OptionProps>;
  value: OptionProps;
  onSelect: (option: OptionProps) => void;
  searchable?: boolean;
}) {
  return (
    <>
      {searchable ?? (
        <div className='c-picker__search'>
          <Searchbar inputStyle={{ borderRadius: '30px' }} />
        </div>
      )}
      <ListCheckOptions
        options={options}
        selectedOption={value}
        onSelect={(option: OptionProps) => {
          onSelect(option);
        }}
      ></ListCheckOptions>
    </>
  );
}
