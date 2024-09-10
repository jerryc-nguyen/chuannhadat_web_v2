import { LuSearch, LuXCircle } from 'react-icons/lu';
import { Input } from './ui/input';
import { useState } from 'react';

export type TSearchBoxProps = {
  placeholder?: string;
  value?: string;
  onClick?: () => {};
  onInput?: (event: A) => void;
  onClear?: () => void;
};

export default function SearchBox(props: TSearchBoxProps) {
  const [curValue, setCurValue] = useState<string>('');
  const placeholder = props.placeholder || 'Tìm kiếm';

  const onChange = (event: A) => {
    setCurValue(event.target.value);
    if (props.onInput) {
      props.onInput(event);
    }
  };

  const onClear = () => {
    setCurValue('');
    if (props.onClear) {
      props.onClear();
    }
  };

  return (
    <div className="relative mt-2" onClick={props.onClick}>
      <LuSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

      {curValue.length > 0 && (
        <LuXCircle
          className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground"
          onClick={onClear}
        />
      )}
      <Input
        value={curValue.toString()}
        className="rounded-full pl-8"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
