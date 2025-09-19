import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts';

export default function usePostDetailTracking() {
  // Track viewed posts to prevent duplicates
  const viewedPostsRef = React.useRef<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Mutation for tracking post views
  const { mutate: trackView } = useMutation({
    mutationFn: postsApi.viewProduct,
    onSuccess: () => {
      // Invalidate viewed posts cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ['get-viewed-post'] });
    },
  });

  // Track view for a post (only if not already viewed)
  const trackPostView = (postId: string) => {
    if (!viewedPostsRef.current.has(postId)) {
      viewedPostsRef.current.add(postId);
      trackView({
        product_uid: postId,
      });
    }
  };

  // Check if a post has been viewed
  const hasBeenViewed = (postId: string): boolean => {
    return viewedPostsRef.current.has(postId);
  };

  // Clear all viewed posts (useful for testing or cleanup)
  const clearViewedPosts = () => {
    viewedPostsRef.current.clear();
  };

  return {
    trackPostView,
    hasBeenViewed,
    clearViewedPosts,
  };
}
