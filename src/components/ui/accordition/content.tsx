import { AccordionContentProps, Content } from '@radix-ui/react-accordion';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Content
      className={twMerge(
        'overflow-hidden text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="px-5 py-[15px]">{children}</div>
    </Content>
  ),
);
