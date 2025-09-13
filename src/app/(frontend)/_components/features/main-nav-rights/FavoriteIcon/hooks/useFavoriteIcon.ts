import { useFavorites, useFavoriteMutations, useFavoriteState } from './index';
import { useViewedPosts } from '@frontend/features/main-nav-rights/FavoriteIcon/hooks/useViewedPosts';

/**
 * Shared hook for FavoriteIcon components (both mobile and desktop)
 * Provides all necessary state and handlers for both saved and viewed posts
 */
export const useFavoriteIcon = (isOpen: boolean) => {
  const { selectedTab, setSelectedTab, loadingDeleteUid, setLoadingDeleteUid } = useFavoriteState();

  // Saved posts logic
  const { savedSummary, savedPosts, isSavedFetching, showBadge, invalidateQueries } = useFavorites(isOpen);

  // Viewed posts logic (using common hook directly)
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

  return {
    // State
    selectedTab,
    loadingDeleteUid,
    showBadge,
    savedSummary,
    savedPosts,
    viewedPosts,
    viewedPagination,
    isSavedFetching,
    isViewedFetching,

    // Handlers
    setSelectedTab,
    handleRemoveSavedPost,
    handleRemoveViewedPost: (uid: string) => handleRemoveViewedPost(uid, deleteViewedPost),
  };
};
