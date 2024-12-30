import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@common/utils';
type TooltipHostProps = {
  children: React.ReactNode;
  content: string | JSX.Element;
  className?: string;
  /** Specifies to show tooltip only when text is overflowed  */
  isOverflow?: boolean;
};

const TooltipHost: React.FC<TooltipHostProps> = ({ children, content, className, isOverflow }) => {
  const textRef = React.useRef<HTMLButtonElement>(null);
  const [isTextOverflow, setIsTextOverflow] = React.useState(false);

  React.useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const hasOverflow = textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsTextOverflow(hasOverflow);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => window.removeEventListener('resize', checkOverflow);
  }, []);
  if (isOverflow) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild ref={textRef}>
            <p className="w-full truncate">{children}</p>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className={cn(
              isTextOverflow ? 'max-w-[20rem] overflow-hidden text-wrap text-center' : '!hidden',
              className,
            )}
          >
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className={cn('max-w-[20rem] overflow-hidden text-wrap text-center', className)}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipHost;
