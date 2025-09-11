import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@common/utils';
import useCleanupEffect from '@common/hooks/useCleanupEffect';
import React from 'react';

type TooltipHostProps = {
  children: React.ReactNode;
  content: string | React.ReactElement;
  className?: string;
  /** Specifies to show tooltip only when text is overflowed  */
  isOverflow?: boolean;
};

const TooltipHost: React.FC<TooltipHostProps> = ({
  children,
  content,
  className,
  isOverflow = false,
}) => {
  const textRef = React.useRef<HTMLButtonElement>(null);
  const [isTextOverflow, setIsTextOverflow] = React.useState(false);

  useCleanupEffect((helpers) => {
    const checkOverflow = () => {
      if (textRef.current) {
        const hasOverflow = textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsTextOverflow(hasOverflow);
      }
    };

    checkOverflow();
    helpers.addEventListener(window, 'resize', checkOverflow);
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
            {children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
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
