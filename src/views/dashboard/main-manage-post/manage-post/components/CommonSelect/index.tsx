import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CircleX } from 'lucide-react';
import { MouseEventHandler } from 'react';

interface CommonSelectProps {
  options: { text: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  showClear?: boolean;
}

export function CommonSelect({ options, onChange, value, placeholder, showClear }: CommonSelectProps) {
  const onClickClear: MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onChange('');
  };

  return (
    <Select onValueChange={onChange} value={value} defaultValue={value}>
      <div className="flex items-center">
        <SelectTrigger className="flex-1">
          <SelectValue defaultValue={value} placeholder={placeholder} />
        </SelectTrigger>
        {!!value && showClear && <CircleX onClick={onClickClear} className='mx-4 cursor-pointer' />}
      </div>
      <SelectContent>
        {options.map((item, index) => (
          <SelectItem key={index} value={item.value}>
            {item.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
