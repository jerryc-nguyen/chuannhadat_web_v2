'use client';
import React from 'react';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { LucideHeart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useFavoriteIcon } from './hooks';
import { FavoriteBadge, FavoriteContent } from './components';

interface FavoriteIconDesktopProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FavoriteIconDesktop: React.FC<FavoriteIconDesktopProps> = ({ isOpen, onOpenChange }) => {
  const searchParams = useSearchParams();
  const hideDangtinButton = searchParams?.get('hide_create_post') == 'true';

  const {
    selectedTab,
    loadingDeleteUid,
    showBadge,
    savedSummary,
    savedPosts,
    viewedPosts,
    viewedPagination,
    isSavedFetching,
    isViewedFetching,
    setSelectedTab,
    handleRemoveSavedPost,
    handleRemoveViewedPost,
  } = useFavoriteIcon(isOpen);

  return (
    <Popover onOpenChange={onOpenChange} open={isOpen}>
      <PopoverTrigger asChild>
        <Button size={'icon'} variant="outline" className="rounded-full relative" aria-label="Xem tin đã lưu và tin đã xem">
          <LucideHeart className="h-5 w-5" />
          {showBadge && <FavoriteBadge savedSummary={savedSummary} isMobile={false} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-[23rem] p-0', {
          'left-1/2 -translate-x-1/2': !hideDangtinButton,
        })}
        side="bottom"
        align="center"
      >
        <FavoriteContent
          isMobile={false}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          savedPosts={savedPosts}
          viewedPosts={viewedPosts}
          viewedPagination={viewedPagination}
          isSavedFetching={isSavedFetching}
          isViewedFetching={isViewedFetching}
          savedSummary={savedSummary}
          loadingDeleteUid={loadingDeleteUid}
          onRemoveSavedPost={handleRemoveSavedPost}
          onRemoveViewedPost={handleRemoveViewedPost}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FavoriteIconDesktop;
