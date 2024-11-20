import * as React from 'react';

import { cn } from '@common/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  endAdornment?: React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, endAdornment, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {endAdornment && (
          <span className="pointer-events-none flex items-center text-muted-foreground">
            {endAdornment}
          </span>
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
