import { postsApi } from '@frontend/PostDetail/api/posts';
import { IViewedProductDetail } from '../types';
import { IPagination } from '@common/types/api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type UseViewedPostsProps = {
  productUid: string;
  defaultPageSize?: number;
  enabled?: boolean;
};

type UseViewedPostsReturn = {
  listProduct: IViewedProductDetail[];
  isFetching: boolean;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  pagination: IPagination | undefined;
  deleteViewedPost: (productUid: string) => Promise<void>;
  isDeleting: boolean;
};

export const useViewedPosts = ({
  productUid,
  defaultPageSize = 3,
  enabled = true,
}: UseViewedPostsProps): UseViewedPostsReturn => {
  const [listProduct, setListProduct] = useState<IViewedProductDetail[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const queryClient = useQueryClient();

  const { data: viewedPosts, isFetching } = useQuery({
    queryKey: ['get-viewed-post', productUid, pageNumber, defaultPageSize],
    queryFn: () =>
      postsApi.getViewedPosts({
        page: pageNumber,
        per_page: defaultPageSize,
      }),
    placeholderData: keepPreviousData,
    enabled,
  });

  const { mutateAsync, isPending: isDeleting } = useMutation({
    mutationFn: (postUid: string) => postsApi.deleteViewedPosts(postUid),
    onSuccess: (_, deletedProductUid) => {
      toast.success('Xóa bài viết đã xem thành công');
      // Update the local list by removing the deleted post
      setListProduct((currentList) =>
        currentList.filter((item) => item.product.uid !== deletedProductUid),
      );

      // Invalidate the query to refetch data if needed
      queryClient.invalidateQueries({ queryKey: ['get-viewed-post'] });
    },
  });

  // Wrapper function to handle the deletion and return void
  const deleteViewedPost = async (productUid: string): Promise<void> => {
    await mutateAsync(productUid);
  };

  useEffect(() => {
    if (viewedPosts?.data) {
      // Replace the data instead of accumulating to prevent duplicates
      setListProduct(viewedPosts.data);
    }
  }, [viewedPosts?.data]);

  return {
    listProduct,
    isFetching,
    pageNumber,
    setPageNumber,
    pagination: viewedPosts?.pagination,
    deleteViewedPost,
    isDeleting,
  };
};
