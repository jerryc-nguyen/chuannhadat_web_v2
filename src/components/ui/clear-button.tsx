import { X } from 'lucide-react';
import { MouseEvent } from 'react';
import { cn } from '@common/utils';

interface ClearButtonProps {
  onClick: (e: MouseEvent) => void;
  className?: string;
  iconClassName?: string;
}

export function ClearButton({
  onClick,
  className,
  iconClassName
}: ClearButtonProps) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "h-6 w-6 p-0 rounded-full border border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors flex items-center justify-center",
        className
      )}
    >
      <X className={cn("h-4 w-4 text-gray-500 hover:text-red-500", iconClassName)} />
      <span className="sr-only">Clear</span>
    </button>
  );
} 
