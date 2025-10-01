'use client';
import { useQuery } from '@tanstack/react-query';
import { IProductList } from '@common/types';
import { userPostsApi } from '@maps/api';

interface UseUserPostsProps {
  authorSlug: string;
  wardId?: number;
  page?: number;
  perPage?: number;
  businessType?: string | null;
  categoryType?: string | null;
}

interface Pagination {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}

interface UseUserPostsReturn {
  posts: IProductList[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: Error | null;
}

export const useUserPosts = ({
  authorSlug,
  wardId,
  page = 1,
  perPage = 5,
  businessType,
  categoryType
}: UseUserPostsProps): UseUserPostsReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-posts-maps', authorSlug, wardId, page, perPage, businessType, categoryType],
    queryFn: () =>
      userPostsApi({
        author_slug: authorSlug,
        ward_id: wardId,
        page,
        per_page: perPage,
        business_type: businessType || undefined,
        category_type: categoryType || undefined,
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
