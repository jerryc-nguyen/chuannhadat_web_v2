import { services } from '@api/services';
import { useQuery } from '@tanstack/react-query';
import { IProductDetail } from '@mobile/searchs/type';

/**
 * Custom hook to fetch post details by post ID
 * @param postId - The ID of the post to fetch
 * @returns Query result with post data and status
 */
export function usePostDetail({ postId, enabled, refetchOnWindowFocus }: { postId: string, enabled: boolean , refetchOnWindowFocus?: boolean }) {
  return useQuery<{ data: IProductDetail }, Error, IProductDetail>({
    queryKey: ['get-detail-post', postId],
    queryFn: () => services.posts.getDetailPost(postId),
    enabled: enabled,
    select: (data) => data.data,
    refetchOnWindowFocus,
  });
}
