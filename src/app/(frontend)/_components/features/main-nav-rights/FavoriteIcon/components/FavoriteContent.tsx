import React from 'react';
import { Separator } from '@components/ui/separator';
import OptionsTabList from '@components/mobile-ui/OptionsTabList';
import { VIEW_OPTIONS } from '../types';
import { useFavorites, useFavoriteMutations, useFavoriteState } from '../hooks';
import { useViewedPosts } from '../hooks/useViewedPosts';
import LoadingListPost from './LoadingListPost';
import ActivityPostsList from './ActivityPostsList';

interface FavoriteContentProps {
  isMobile: boolean;
  isOpen: boolean;
}

const FavoriteContent: React.FC<FavoriteContentProps> = ({
  isMobile,
  isOpen,
}) => {
  // Use hooks directly instead of intermediate useFavoriteIcon
  const { selectedTab, setSelectedTab, loadingDeleteUid, setLoadingDeleteUid } = useFavoriteState();

  // Saved posts logic
  const { savedSummary, savedPosts, isSavedFetching, invalidateQueries } = useFavorites(isOpen);

  // Viewed posts logic
  const {
    listProduct: viewedPosts,
    pagination: viewedPagination,
    isFetching: isViewedFetching,
    deleteViewedPost,
  } = useViewedPosts({
    productUid: '',
    defaultPageSize: 20,
    enabled: isOpen,
  });

  // Mutations for both saved and viewed posts
  const { handleRemoveSavedPost, handleRemoveViewedPost } = useFavoriteMutations(invalidateQueries, setLoadingDeleteUid);

  return (
    <>
      <div className="px-0 py-2 text-center text-lg font-semibold lg:px-5">
        <OptionsTabList
          options={VIEW_OPTIONS}
          value={selectedTab}
          onChange={setSelectedTab}
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
              handleRemovePost={handleRemoveSavedPost}
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
                handleRemovePost={(uid) => handleRemoveViewedPost(uid, deleteViewedPost)}
              />
            )}
          </>
        )}
      </section>
    </>
  );
};

export default FavoriteContent;
