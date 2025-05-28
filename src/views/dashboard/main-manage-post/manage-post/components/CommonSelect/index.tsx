import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { MouseEvent } from 'react';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';

interface CommonSelectProps {
  options: { text: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  showClear?: boolean;
}

export function CommonSelect({ options, onChange, value, placeholder, showClear }: CommonSelectProps) {
  const onClickClear = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange('');
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <Select onValueChange={onChange} value={value} defaultValue={value}>
      <div className="relative">
        <SelectTrigger className="w-full">
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {selectedOption?.text || placeholder || 'Vui lòng chọn'}
          </span>
        </SelectTrigger>
        {!!value && showClear && (
          <Button
            variant="outline"
            onClick={onClickClear}
            className="h-6 w-6 p-0 rounded-full border border-muted hover:border-red-500 hover:bg-red-50 transition-colors absolute right-8 top-1/2 -translate-y-1/2"
            type="button"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
            <span className="sr-only">Clear</span>
          </Button>
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
