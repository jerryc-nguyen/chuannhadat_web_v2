import React from 'react';
import { cn } from '@common/utils';

type Props = {
  total: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

const DotNavigation: React.FC<Props> = ({ total, selectedIndex, onSelect, className }) => {
  if (total <= 1) return null;

  return (
    <div className={cn('absolute bottom-2 left-1/2 transform -translate-x-1/2', className)}>
      <div className="flex gap-1 rounded-full bg-black/15 px-2 py-1">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all border',
              'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-black/20',
              index === selectedIndex
                ? 'bg-white border-white'
                : 'bg-white/70 border-white/60 hover:bg-white',
            )}
            onClick={() => onSelect(index)}
            aria-label={`Go to image ${index + 1}`}
            aria-current={index === selectedIndex ? 'true' : 'false'}
            tabIndex={0}
          />
        ))}
      </div>
    </div>
  );
};

export default DotNavigation;
