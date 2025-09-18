import * as React from 'react';

import { cn } from '@common/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const defaultOption = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];
export const roundedOptionsInputVariants = cva(
  'flex flex-1 items-center h-10 w-full px-3 py-2 text-sm bg-transparent file:border-0 file:text-sm file:font-medium placeholder:text-secondary disabled-within:cursor-not-allowed disabled-within:opacity-50 disabled-within:bg-muted border border-transparent focus-within:outline-none aria-invalid:ring-1 aria-invalid:ring-destructive aria-invalid:focus-within:ring-2 aria-invalid:focus-within:ring-destructive',

  {
    variants: {
      rounded: {
        none: 'rounded-none',
        md: 'rounded-md',
      },
      variant: {
        outline:
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 disabled-within:cursor-not-allowed disabled-within:opacity-50',
        filled: 'border-2 bg-background focus-within:border-primary focus-within:bg-transparent',
        underlined:
          'rounded-none border-b-border focus-within:border-b-primary focus-within:shadow-[0_1px_0px_0px_hsl(var(--primary))]',
        unstyled: '',
      },
    },
    defaultVariants: {
      rounded: 'md',
      variant: 'outline',
    },
  },
);

export interface RoundedOptionsInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof roundedOptionsInputVariants> {
  endAdornment?: React.ReactNode;
  hiddenSelect?: boolean;
}

const RoundedOptionsNumberInput = React.forwardRef<HTMLInputElement, RoundedOptionsInputProps>(
  ({ className, rounded, variant, endAdornment, value, onChange, hiddenSelect, ...props }, ref) => {
    const defaultInputValue = parseInt(value + '') < 6 ? '' : value + '';
    const [inputValue, setInputValue] = React.useState<string>(defaultInputValue);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Regular expression to allow only numbers, with one optional comma or period, not at the beginning
      const regex = /^(?![.,])\d+([.,]\d{0,})?$/;

      if (regex.test(value) || value === '') {
        setInputValue(e.target.value);
        onChange?.(e);
      }
    };

    const handleInputBlur = () => {
      if (defaultOption.some((option) => option.value === inputValue.toString())) {
        // If inputValue matches one of the options, clear the input field
        setInputValue('');
      }
    };

    return (
      <div className="flex flex-wrap gap-3">
        <div className={twMerge('flex items-center gap-2', hiddenSelect && 'hidden')}>
          {defaultOption.map((item, index) => {
            const selected = value?.toString() === item.value;
            return (
              <div
                key={index}
                className={`cnd-chip flex min-h-12 min-w-12 justify-center ${selected ? 'bg-black text-white' : ''}`}
                onClick={() => {
                  setInputValue('');
                  onChange?.({
                    target: { value: item.value },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>

        <div
          className={cn(roundedOptionsInputVariants({ variant, rounded, className }), className)}
          style={{ minWidth: '100px' }}
        >
          <input
            ref={ref}
            {...props}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={cn(
              'w-full bg-transparent outline-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
              {
                'pr-1.5': !!endAdornment,
              },
            )}
          />
          {endAdornment && <span className="flex items-center text-secondary">{endAdornment}</span>}
        </div>
      </div>
    );
  },
);
RoundedOptionsNumberInput.displayName = 'RoundedOptionsInput';

export { RoundedOptionsNumberInput as RoundedOptionsNumberInput };
