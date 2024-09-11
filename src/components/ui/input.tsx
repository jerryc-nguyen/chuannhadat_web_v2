import * as React from 'react';

import { cn } from '@common/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';

export const inputVariants = cva(
  'flex items-center h-10 w-full px-3 py-2 text-sm bg-transparent file:border-0 file:text-sm file:font-medium placeholder:text-muted-foreground disabled-within:cursor-not-allowed disabled-within:opacity-50 disabled-within:bg-muted border border-transparent focus-within:outline-none aria-invalid:ring-1 aria-invalid:ring-destructive aria-invalid:focus-within:ring-2 aria-invalid:focus-within:ring-destructive',

  {
    variants: {
      rounded: {
        none: 'rounded-none',
        md: 'rounded-md',
      },
      variant: {
        outline:
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 disabled-within:cursor-not-allowed disabled-within:opacity-50',
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

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, rounded, variant, startAdornment, endAdornment, ...props }, ref) => {
    const [typeInput, setTypeInput] = React.useState(type);
    if (type !== 'password') {
      return (
        <div className={cn(inputVariants({ variant, rounded, className }), className)}>
          {startAdornment && (
            <span className="flex items-center text-2xs text-muted-foreground">
              {startAdornment}
            </span>
          )}
          <input
            ref={ref}
            {...props}
            className={cn(
              'w-full bg-transparent outline-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
              {
                'pl-1.5': !!startAdornment,
                'pr-1.5': !!endAdornment,
              },
            )}
          />
          {endAdornment && (
            <span className="flex items-center text-muted-foreground">{endAdornment}</span>
          )}
        </div>
      );
    }
    return (
      <div className="relative">
        <input
          type={typeInput}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {type === 'password' && typeInput === 'text' && (
          <EyeOpenIcon
            onClick={() => setTypeInput('password')}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            height={20}
            width={20}
          />
        )}
        {type === 'password' && typeInput === 'password' && (
          <EyeClosedIcon
            onClick={() => setTypeInput('text')}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            height={20}
            width={20}
          />
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
