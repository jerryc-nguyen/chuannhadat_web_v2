import React from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@common/utils';

type Props = {
  count?: number;
  className?: string;
};

const MediaCount: React.FC<Props> = ({ count = 0, className }) => {
  if (!count || count <= 0) return null;
  return (
    <div
      className={cn(
        'absolute right-2 bottom-2 flex items-center gap-1 rounded-full px-3 py-1 text-white bg-black/15',
        className,
      )}
    >
      <ImageIcon size={18} />
      <span>{count}</span>
    </div>
  );
};

export default MediaCount;
