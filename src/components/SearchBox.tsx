import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useState } from 'react';
import { ClearButton } from './ui/clear-button';

export type TSearchBoxProps = {
  placeholder?: string;
  value?: string;
  onClick?: () => void;
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
      <Search className="absolute left-3 top-3 h-4 w-4 text-secondary" />

      {curValue.length > 0 && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 mr-2">
          <ClearButton
            onClick={onClear}
            className="h-5 w-5"
            iconClassName="h-4 w-4"
          />
        </div>
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
