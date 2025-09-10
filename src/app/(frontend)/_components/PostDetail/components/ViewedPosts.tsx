'use client';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@components/ui/carousel';
import { Skeleton } from '@components/ui/skeleton';
import useCleanupEffect from '@hooks/useCleanupEffect';
import { useViewedPosts } from '@hooks/useViewedPosts';
import ProductCard from '@frontend/HomePage/components/ProductCard';
import { Loader2 } from 'lucide-react';
import React, { memo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

type ViewedPostsProps = {
  productUid: string;
  isInsideModal?: boolean;
};

const defaultPageSize = 3;
const ViewedPosts: React.FC<ViewedPostsProps> = ({ productUid, isInsideModal = false }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const isScrollNext = useRef<boolean>(false);

  const { listProduct, isFetching, pageNumber, setPageNumber, pagination } = useViewedPosts({
    productUid,
    defaultPageSize,
  });

  useCleanupEffect(
    (helpers) => {
      if (listProduct && isScrollNext.current) {
        helpers.setTimeout(() => {
          api?.scrollNext();
          isScrollNext.current = false;
        }, 0.2);
      }
    },
    [listProduct.length, api],
  );

  const handleScrollNext = () => {
    if (pagination && pageNumber < pagination?.total_pages) {
      setPageNumber((pageNumber) => pageNumber + 1);
      isScrollNext.current = true;
    } else {
      api?.scrollNext();
    }
  };

  const handleScrollPrevious = () => {
    api?.scrollPrev();
  };

  const onSelect = React.useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    setPrevBtnEnabled(api.canScrollPrev());
  }, [api, setSelectedIndex]);

  useCleanupEffect(
    (helpers) => {
      if (!api) return;
      onSelect();
      api.on('select', onSelect);

      helpers.addCleanup(() => {
        api.off('select', onSelect);
      });
    },
    [api, onSelect],
  );
  const loadingViewdPost = () => {
    return <div className="flex gap-x-4 w-full">
      {Array.from({ length: 3 }).fill(0).map(_item => (
        <div key={uuidv4()} className="flex-1 p-4 overflow-hidden rounded-md border">
          <Skeleton className='w-full h-[188px]' />
          <div className="pt-4">
            <Skeleton className='h-4 w-1/3' />
            <div className="mt-2">
              <Skeleton className='h-5 w-full' />
              <Skeleton className='h-5 w-full mt-1' />
            </div>
            <Skeleton className='h-4 mt-2 w-2/3' />
          </div>
        </div>
      ))}
    </div>
  }


  if (pagination?.total_count === 0) return null;
  return (
    <section className={cn('flex w-full flex-col gap-1 rounded-xl border bg-white p-6')}>
      <div
        className={cn(
          'flex justify-between',
          pagination?.total_count === defaultPageSize ? 'hidden' : 'flex',
        )}
      >
        <h3 className="pb-5 text-xl font-semibold">Tin vừa xem</h3>
        <section className="flex gap-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={isFetching || !prevBtnEnabled}
            onClick={handleScrollPrevious}
          >
            <ChevronLeft className="text-xl" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex items-center justify-center gap-x-2"
            disabled={isFetching || selectedIndex + defaultPageSize === pagination?.total_count}
            onClick={handleScrollNext}
          >
            {isFetching && pageNumber !== 1 ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ChevronRight className="text-xl" />
            )}
          </Button>
        </section>
      </div>
      {isFetching ? (
        loadingViewdPost()
      ) : (
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className={cn('w-full', isInsideModal ? 'sm:max-w-[45vw]' : 'sm:max-w-[66vw]')}
          setApi={setApi}
        >
          <CarouselContent>
            {listProduct.map((item: A) => (
              <CarouselItem
                className={cn('', isInsideModal ? 'lg:basis-1/2' : 'md:basis-1/2 lg:basis-1/3')}
                key={uuidv4()}
              >
                <ProductCard
                  isShowVideoYoutube={false}
                  isShowAuthor={false}
                  product={item?.product}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

    </section>
  );
};

export default memo(ViewedPosts);
