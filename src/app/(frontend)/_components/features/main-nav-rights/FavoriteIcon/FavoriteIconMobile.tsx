'use client';
import React from 'react';
import { Button } from '@components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui/sheet';
import { LucideHeart } from 'lucide-react';
import { useFavoriteIcon } from './hooks';
import { FavoriteBadge, FavoriteContent } from './components';

interface FavoriteIconMobileProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FavoriteIconMobile: React.FC<FavoriteIconMobileProps> = ({ isOpen, onOpenChange }) => {
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
    <Sheet onOpenChange={onOpenChange} open={isOpen}>
      <SheetTrigger asChild>
        <Button size={'icon'} variant="outline" className="rounded-full relative" aria-label="Xem tin đã lưu và tin đã xem">
          <LucideHeart className="h-5 w-5" />
          {showBadge && <FavoriteBadge savedSummary={savedSummary} isMobile={true} />}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] p-0">
        <SheetHeader className="p-3">
          <SheetTitle className="pt-6">
            <FavoriteContent
              isMobile={true}
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
          </SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default FavoriteIconMobile;
