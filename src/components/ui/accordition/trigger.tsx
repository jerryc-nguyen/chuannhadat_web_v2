import { AccordionTriggerProps, Header, Trigger } from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Header className="flex">
      <Trigger
        className={twMerge(
          'group flex h-[45px] flex-1 items-center justify-between bg-white px-5 text-[15px] leading-none outline-none hover:bg-mauve2',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon
          className="ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Trigger>
    </Header>
  ),
);
