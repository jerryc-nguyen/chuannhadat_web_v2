import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuth } from '@common/auth/AuthContext';
import { useSetAtom } from 'jotai';
import { listPostIdSavedAtom } from '@frontend/CategoryPage/states';
import { useViewedPosts } from '@common/hooks/useViewedPosts';
import { favoritesApi } from '../api/favorites';
import { FavoriteData } from '../types';

/**
 * Main hook for managing favorites functionality
 * Handles data fetching, state management, and badge visibility
 */
export const useFavorites = (isOpen: boolean) => {
  const { currentUser } = useAuth();
  const setListPostIdSaved = useSetAtom(listPostIdSavedAtom);
  const queryClient = useQueryClient();
  const [showBadge, setShowBadge] = useState<boolean>(true);

  // Fetch saved posts summary
  const { data: savedSummary, isSuccess } = useQuery({
    queryKey: ['save_summary', currentUser?.api_token],
    queryFn: () => favoritesApi.getSavedSummary(),
    select: (data) => data.data,
  });

  // Fetch saved posts list
  const { data: savedPosts, isFetching: isSavedFetching } = useQuery({
    queryKey: ['list_saves_post'],
    queryFn: () => favoritesApi.getSavedPosts(),
    enabled: isOpen,
    staleTime: 0,
  });

  // Fetch viewed posts
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

  // Update badge visibility based on saved posts
  useEffect(() => {
    if (isSuccess) {
      const hasSavedPosts = savedSummary && savedSummary.saved_product_uids.length > 0;
      setShowBadge(hasSavedPosts);
    }
  }, [isSuccess, savedSummary]);

  // Update global state with saved post IDs
  useEffect(() => {
    if (savedSummary) {
      setListPostIdSaved(savedSummary.saved_product_uids);
    }
  }, [savedSummary?.saved_product_uids, setListPostIdSaved]);

  // Invalidate queries when needed
  const invalidateQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['save_summary'] }),
      queryClient.invalidateQueries({ queryKey: ['list_saves_post'] }),
    ]);
  };

  const favoriteData: FavoriteData = {
    savedSummary,
    savedPosts,
    viewedPosts,
    viewedPagination,
  };

  return {
    favoriteData,
    isSavedFetching,
    isViewedFetching,
    showBadge,
    deleteViewedPost,
    invalidateQueries,
  };
};
