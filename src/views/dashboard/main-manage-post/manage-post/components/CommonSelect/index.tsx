import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MouseEvent } from 'react';
import { cn } from '@common/utils';
import { ClearButton } from '@components/ui/clear-button';

interface CommonSelectProps {
  options: { text: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  showClear?: boolean;
  showIconWhenSelected?: boolean;
}

export function CommonSelect({
  options,
  onChange,
  value,
  placeholder,
  showClear,
  showIconWhenSelected = false
}: CommonSelectProps) {
  const onClickClear = (e: MouseEvent) => {
    onChange('');
  };

  const selectedOption = options.find(option => option.value === value);
  // Show icon when no value is selected or showIconWhenSelected is true
  const showIcon = !value || showIconWhenSelected;

  return (
    <Select onValueChange={onChange} value={value} defaultValue={value}>
      <div className="relative">
        <SelectTrigger className="w-full" showIcon={showIcon}>
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {selectedOption?.text || placeholder || 'Vui lòng chọn'}
          </span>
        </SelectTrigger>
        {!!value && showClear && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ClearButton onClick={onClickClear} />
          </div>
        )}
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
