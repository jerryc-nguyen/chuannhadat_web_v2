import { AccordionItemProps, Item } from '@radix-ui/react-accordion';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Item className={twMerge('bg-white', className)} {...props} ref={forwardedRef}>
      {children}
    </Item>
  ),
);
