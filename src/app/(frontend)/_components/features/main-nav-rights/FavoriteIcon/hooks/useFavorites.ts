import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuth } from '@common/auth/AuthContext';
import { useSetAtom } from 'jotai';
import { listPostIdSavedAtom } from '@frontend/CategoryPage/states';
import { savesApi } from '../api/saves';

/**
 * Main hook for managing favorites functionality
 * Handles saved posts data fetching, state management, and badge visibility
 */
export const useFavorites = (isOpen: boolean) => {
  const { currentUser } = useAuth();
  const setListPostIdSaved = useSetAtom(listPostIdSavedAtom);
  const queryClient = useQueryClient();
  const [showBadge, setShowBadge] = useState<boolean>(true);

  // Fetch saved posts summary
  const { data: savedSummary, isSuccess } = useQuery({
    queryKey: ['save_summary', currentUser?.api_token],
    queryFn: () => savesApi.savedSummary(),
    select: (data) => data.data,
  });

  // Fetch saved posts list
  const { data: savedPosts, isFetching: isSavedFetching } = useQuery({
    queryKey: ['list_saves_post'],
    queryFn: () => savesApi.savedPosts(),
    enabled: isOpen,
    staleTime: 0,
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
  }, [savedSummary, setListPostIdSaved]);

  // Invalidate queries when needed
  const invalidateQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['save_summary'] }),
      queryClient.invalidateQueries({ queryKey: ['list_saves_post'] }),
    ]);
  };

  return {
    savedSummary,
    savedPosts,
    isSavedFetching,
    showBadge,
    invalidateQueries,
  };
};
