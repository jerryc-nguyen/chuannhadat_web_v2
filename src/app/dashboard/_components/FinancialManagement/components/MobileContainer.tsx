import React from 'react';
import { cn } from '@common/utils';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

/**
 * Standardized mobile container for Financial Management pages
 * Provides consistent spacing and layout for mobile views
 */
const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  className,
  noPadding = false
}) => {
  return (
    <div className={cn(
      'c-mobileApp w-full',
      !noPadding && 'px-4 py-4',
      className
    )}>
      {children}
    </div>
  );
};

export default MobileContainer;
