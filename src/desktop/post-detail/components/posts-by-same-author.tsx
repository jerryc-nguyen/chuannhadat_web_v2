import { services } from '@api/services';
import TooltipHost from '@components/tooltip-host';
import { Card, CardContent } from '@components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@components/ui/carousel';
import { Skeleton } from '@components/ui/skeleton';
import ProductCard from '@desktop/home/ProductCard';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

type PostsBySameAuthorProps = {
  productId: string;
  authorId: number | undefined;
  fullNameAuthor: string | undefined;
};

const PostsBySameAuthor: React.FC<PostsBySameAuthorProps> = ({ productId, authorId, fullNameAuthor }) => {
  const { data: relatedPosts, isLoading } = useQuery({
    queryKey: ['get-posts-same-author', productId],
    queryFn: () => services.posts.getPostsSameAuthor(productId),
    enabled: !!productId,
    select: (data) => data.data,
  });
  if (relatedPosts?.length === 0) return null;
  return (
    <>
      <TooltipHost content={'Chỉ hiện tin có ngày đăng trong 2 tuần gần nhất'}>
        <h3 className="my-2 mt-4 cursor-pointer text-lg text-slate-500">Tin khác của {fullNameAuthor}</h3>
      </TooltipHost>
      {isLoading ? (
        <div className="rounded-lg bg-white p-4">
          <div className="bg-bg-secondary shadow-2 mb-4 rounded-lg">
            <Skeleton className="h-32 w-full rounded-b-none" />
            <div className="p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-full" />
            </div>
          </div>
        </div>
      ) : (
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {relatedPosts?.slice(0, 2)?.map((post, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <ProductCard product={post} isShowAuthor={false} />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
            {relatedPosts && relatedPosts?.length > 1 && (
              <CarouselItem>
                <Card>
                  <CardContent className="relative flex aspect-square items-center justify-center p-6">
                    <ProductCard product={relatedPosts[2]} isShowAuthor={false} />
                    <Link
                      href={`profile/${authorId}`}
                      className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 text-xl font-medium text-white hover:underline"
                    >
                      Xem thêm
                    </Link>
                  </CardContent>
                </Card>
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      )}
    </>
  );
};

export default PostsBySameAuthor;
