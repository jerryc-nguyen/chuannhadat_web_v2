import React from 'react';
import { cn } from '@common/utils';
import { Badge } from '@components/ui/badge';
import { ISavesSummaryResponse } from '../types';

interface FavoriteBadgeProps {
  savedSummary?: ISavesSummaryResponse['data'];
  isMobile: boolean;
}

const FavoriteBadge: React.FC<FavoriteBadgeProps> = ({ savedSummary, isMobile }) => {
  return (
    <Badge
      className={cn(
        'absolute -right-2 top-0 ml-auto flex aspect-square shrink-0 items-center justify-center rounded-full border border-white p-0',
        isMobile ? 'h-6 w-6 -translate-y-1/2' : 'h-5 w-5 -translate-y-[7px] text-[10px]',
        savedSummary
          ? 'bg-error_color hover:bg-error_color'
          : 'bg-transparent hover:bg-transparent',
      )}
    >
      {savedSummary ? (
        savedSummary.saved_product_uids.length
      ) : (
        <span className="relative flex h-4 w-4 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary_color opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-primary_color" />
        </span>
      )}
    </Badge>
  );
};

export default FavoriteBadge;
