import { services } from '@api/services';
import { IViewedProductDetail } from '@mobile/searchs/type';
import { Pagination } from '@models/savesPostModel';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type UseViewedPostsProps = {
  productUid: string;
  defaultPageSize?: number;
};

type UseViewedPostsReturn = {
  listProduct: IViewedProductDetail[];
  isFetching: boolean;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  pagination: Pagination | undefined
};

// TODO: check if listProduct & viewedPosts is duplicate
export const useViewedPosts = ({
  productUid,
  defaultPageSize = 3,
}: UseViewedPostsProps): UseViewedPostsReturn => {
  const [listProduct, setListProduct] = useState<IViewedProductDetail[]>([]);
  const [pageNumber, setPageNumber] = useState(1);

  const { data: viewedPosts, isFetching } = useQuery({
    queryKey: ['get-viewed-post', productUid, pageNumber, defaultPageSize],
    queryFn: () =>
      services.posts.getViewedPosts({
        page: pageNumber,
        per_page: defaultPageSize,
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (viewedPosts?.data) {
      setListProduct((data) => {
        const activeData = data.filter((item) => item !== undefined);
        return [...activeData, ...viewedPosts.data];
      });
    }
  }, [viewedPosts?.data]);

  return {
    listProduct,
    isFetching,
    pageNumber,
    setPageNumber,
    pagination: viewedPosts?.pagination,
  };
};
