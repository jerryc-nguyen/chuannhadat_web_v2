import React from 'react';
import { Separator } from '@components/ui/separator';
import OptionsTabList from '@components/mobile-ui/OptionsTabList';
import { VIEW_OPTIONS, ISavedProductsResponse, ISavesSummaryResponse, IViewedProductDetail, OptionForSelect } from '../types';
import LoadingListPost from './LoadingListPost';
import ActivityPostsList from './ActivityPostsList';

interface FavoriteContentProps {
  isMobile: boolean;
  selectedTab: OptionForSelect;
  onTabChange: (selected: OptionForSelect) => void;
  savedPosts?: ISavedProductsResponse;
  viewedPosts: IViewedProductDetail[];
  viewedPagination?: any;
  isSavedFetching: boolean;
  isViewedFetching: boolean;
  savedSummary?: ISavesSummaryResponse['data'];
  loadingDeleteUid: string;
  onRemoveSavedPost: (uid: string) => Promise<void>;
  onRemoveViewedPost: (uid: string) => Promise<void>;
}

const FavoriteContent: React.FC<FavoriteContentProps> = ({
  isMobile,
  selectedTab,
  onTabChange,
  savedPosts,
  viewedPosts,
  viewedPagination,
  isSavedFetching,
  isViewedFetching,
  savedSummary,
  loadingDeleteUid,
  onRemoveSavedPost,
  onRemoveViewedPost,
}) => {
  return (
    <>
      <div className="px-0 py-2 text-center text-lg font-semibold lg:px-5">
        <OptionsTabList
          options={VIEW_OPTIONS}
          value={selectedTab}
          onChange={onTabChange}
        />
      </div>
      <Separator />
      <section
        className={isMobile ? 'max-h-[90vh] scrollbar-hide' : 'max-h-[50vh] scrollbar-hide'}
        style={{ overflowY: 'auto' }}
      >
        {selectedTab?.value === 'saved' ? (
          isSavedFetching ? (
            <LoadingListPost length={savedSummary?.saved_product_uids.length} />
          ) : (
            <ActivityPostsList
              data={savedPosts?.data ?? []}
              pagination={savedPosts?.pagination}
              loadingRemovePostId={loadingDeleteUid}
              handleRemovePost={onRemoveSavedPost}
            />
          )
        ) : (
          <>
            {isViewedFetching ? (
              <LoadingListPost length={10} />
            ) : (
              <ActivityPostsList
                data={viewedPosts}
                pagination={viewedPagination}
                loadingRemovePostId={loadingDeleteUid}
                handleRemovePost={onRemoveViewedPost}
              />
            )}
          </>
        )}
      </section>
    </>
  );
};

export default FavoriteContent;
