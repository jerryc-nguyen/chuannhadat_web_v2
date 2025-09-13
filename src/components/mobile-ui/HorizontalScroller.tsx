import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
};

export default function HorizontalScroller({
  className,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={twMerge('scrollbar-hide flex flex-row overflow-x-scroll', className)}>
      {children}
    </div>
  );
}
