import { services } from '@api/services';
import RelatedCard from '@components/related-product-card';
import TooltipHost from '@components/tooltip-host';
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
};

const PostsBySameAuthor: React.FC<PostsBySameAuthorProps> = ({
  productId,
  authorSlug,
  fullNameAuthor,
}) => {
  const { data: relatedPosts, isLoading } = useQuery({
    queryKey: ['get-posts-same-author', productId],
    queryFn: () => services.posts.getPostsSameAuthor(productId),
    enabled: !!productId,
    select: (data) => data.data,
  });
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
  if (relatedPosts?.length === 0 || isLoading || !productId) return loadingRelatedCard();
  return (
    <>
      <TooltipHost content={'Chỉ hiện tin có ngày đăng trong 2 tuần gần nhất'}>
        <h3 className="my-2 mt-4 cursor-pointer text-lg text-slate-500">
          Tin khác của {fullNameAuthor}
        </h3>
      </TooltipHost>
      <Carousel className="w-full">
        <CarouselContent>
          {relatedPosts?.slice(0, 2)?.map((post, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="group p-4">
                  <RelatedCard product={post} />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
          {relatedPosts && relatedPosts?.length > 1 && (
            <CarouselItem>
              <Card>
                <CardContent className="relative overflow-hidden p-4">
                  <RelatedCard product={relatedPosts[2]} />
                  <Link
                    href={`/profile/${authorSlug}`}
                    onClick={onCloseModal}
                    className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 text-xl font-medium text-white hover:underline"
                  >
                    Xem thêm
                  </Link>
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
