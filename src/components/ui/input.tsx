'use client';
import * as React from 'react';
import { cn } from '@common/utils';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [typeInput, setTypeInput] = React.useState(type);
    if (type !== 'password') {
      return (
        <input
          type={typeInput}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
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
