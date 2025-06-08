import { services } from '@api/services';
import RelatedCard from '@components/related-product-card';
import { Card, CardContent } from '@components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@components/ui/carousel';
import { Skeleton } from '@components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

import useModalPostDetail from '../hooks/useModalPostDetail';

type PostsBySameAuthorProps = {
  productId: string;
  authorSlug: string | undefined;
  fullNameAuthor: string | undefined;
  totalCount?: number;
};

const MAX_POSTS = 8;

const PostsBySameAuthor: React.FC<PostsBySameAuthorProps> = ( props ) => {
  const { productId,
    authorSlug,
    fullNameAuthor,
    totalCount } = props
  const {
    data: relatedPosts,
    isLoading,
    isSuccess,
    status,
  } = useQuery( {
    queryKey: ['get-posts-same-author', productId],
    queryFn: () => services.posts.getPostsSameAuthor( productId ),
    enabled: !!productId,
    select: ( data ) => data.data,
  } );

  const { onCloseModal } = useModalPostDetail();

  const loadingRelatedCard = () => (
    <div className="w-full">
      <Skeleton className="my-2 mt-4 h-7" />
      <div className="related-card rounded-lg bg-white p-4">
        <div className="card-title mb-3 flex flex-col gap-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex gap-x-4">
          <Skeleton className="aspect-square w-[120px]" />
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex w-full justify-between">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-12" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
        <Skeleton className="mt-2 h-10 w-full" />
      </div>
    </div>
  );

  if ( ( isSuccess && relatedPosts.length === 0 ) || status === 'error' ) return null;
  if ( isLoading || !productId ) return loadingRelatedCard();
  return (
    <>
      <h3 className="mt-6 cursor-pointer text-lg font-bold">
        Tin khác của {fullNameAuthor}
      </h3>
      <span className='text-gray text-xs italic'>
        Chỉ hiện tin có ngày đăng trong 2 tuần gần nhất
      </span>

      <Carousel className="w-full mt-4">
        <CarouselContent>
          {relatedPosts?.map( ( post, index ) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="group p-4">
                  <RelatedCard product={post} />
                </CardContent>
              </Card>
            </CarouselItem>
          ) )}

          {relatedPosts && relatedPosts?.length >= MAX_POSTS && (
            <CarouselItem>
              <Card>
                <CardContent className="flex p-0 h-full">
                  <div className="relative w-full h-full min-h-[228px]">
                    <Link
                      href={`/profile/${authorSlug}`}
                      onClick={onCloseModal}
                      className="absolute inset-0 flex items-center justify-center w-full h-full rounded-lg bg-black/60 text-xl font-medium text-white hover:underline"
                    >
                      {( totalCount && totalCount > MAX_POSTS ) ? `Xem thêm ${totalCount - relatedPosts?.length}+ tin` : 'Xem thêm'}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="left-6 shadow-md" />
        <CarouselNext className="right-3 shadow-md" />
      </Carousel>
    </>
  );
};

export default PostsBySameAuthor;
