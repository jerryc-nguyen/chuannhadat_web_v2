import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
type TooltipHostProps = {
  children: React.ReactNode;
  content: string | JSX.Element;
};

const TooltipHost: React.FC<TooltipHostProps> = ({ children, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-[15rem] text-center">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipHost;
