import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@common/utils';
type TooltipHostProps = {
  children: React.ReactNode;
  content: string | JSX.Element;
  className?: string;
};

const TooltipHost: React.FC<TooltipHostProps> = ({ children, content, className }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={cn('max-w-[12rem] text-center', className)}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipHost;
