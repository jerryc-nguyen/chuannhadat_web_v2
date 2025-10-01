'use client';
import { useQuery } from '@tanstack/react-query';
import { IProductList } from '@common/types';
import { userPostsApi } from '@maps/api';

interface UseUserPostsProps {
  authorSlug: string;
  wardId?: number;
  page?: number;
  perPage?: number;
}

interface UseUserPostsReturn {
  posts: IProductList[];
  pagination: any;
  isLoading: boolean;
  error: Error | null;
}

export const useUserPosts = ({
  authorSlug,
  wardId,
  page = 1,
  perPage = 5
}: UseUserPostsProps): UseUserPostsReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-posts-maps', authorSlug, wardId, page, perPage],
    queryFn: () =>
      userPostsApi({
        author_slug: authorSlug,
        ward_id: wardId,
        page,
        per_page: perPage,
      }),
    enabled: !!authorSlug,
  });

  const posts = data?.data || [];
  const pagination = data?.pagination;

  return {
    posts,
    pagination,
    isLoading,
    error,
  };
};
