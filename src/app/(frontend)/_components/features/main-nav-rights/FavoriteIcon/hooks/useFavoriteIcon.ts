import { useFavorites, useFavoriteMutations, useFavoriteState } from './index';

/**
 * Shared hook for FavoriteIcon components (both mobile and desktop)
 * Provides all necessary state and handlers
 */
export const useFavoriteIcon = (isOpen: boolean) => {
  const { selectedTab, setSelectedTab, loadingDeleteUid, setLoadingDeleteUid } = useFavoriteState();
  const { favoriteData, isSavedFetching, isViewedFetching, showBadge, deleteViewedPost, invalidateQueries } = useFavorites(isOpen);
  const { handleRemoveSavedPost, handleRemoveViewedPost } = useFavoriteMutations(invalidateQueries, setLoadingDeleteUid);

  // Extract data from favoriteData
  const { savedSummary, savedPosts, viewedPosts, viewedPagination } = favoriteData;

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
