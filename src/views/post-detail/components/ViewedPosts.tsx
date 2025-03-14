import { services } from '@api/services';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@components/ui/carousel';
import ProductCard from '@views/home/components/ProductCard';
import { IProductDetail } from '@mobile/searchs/type';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import useCleanupEffect from '@hooks/useCleanupEffect';

type ViewedPostsProps = {
  productUid: string;
  isInsideModal?: boolean;
};

const defaultpageSize = 3;
const ViewedPosts: React.FC<ViewedPostsProps> = ({ productUid, isInsideModal = false }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [listProduct, setListProduct] = React.useState<(IProductDetail | undefined)[]>([
    undefined,
    undefined,
    undefined,
  ]);
  const isScrollNext = React.useRef<boolean>(false);
  const [pageNumber, setPageNumber] = React.useState(1);

  const { data: viewedPosts, isFetching } = useQuery({
    queryKey: ['get-viewed-post', productUid, pageNumber, defaultpageSize],
    queryFn: () =>
      services.posts.getViewedPosts({
        page: pageNumber,
        per_page: defaultpageSize,
      }),
    placeholderData: keepPreviousData,
  });

  useCleanupEffect((helpers) => {
    if (listProduct && isScrollNext.current) {
      helpers.setTimeout(() => {
        api?.scrollNext();
        isScrollNext.current = false;
      }, 0.2);
    }
  }, [listProduct.length, api]);

  React.useEffect(() => {
    if (viewedPosts?.data) {
      setListProduct((data) => {
        const activeData = data.filter((item) => item !== undefined);
        return [...activeData, ...viewedPosts.data];
      });
    }
  }, [viewedPosts?.data]);

  const handleScrollNext = () => {
    if (viewedPosts && pageNumber < viewedPosts?.pagination.total_pages) {
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

  useCleanupEffect((helpers) => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);

    helpers.addCleanup(() => {
      api.off('select', onSelect);
    });
  }, [api, onSelect]);

  if (viewedPosts?.pagination.total_count === 0) return null;
  return (
    <section className={cn('flex w-full flex-col gap-1 rounded-xl border bg-white p-6')}>
      <div
        className={cn(
          'flex justify-between',
          viewedPosts?.pagination.total_count === defaultpageSize ? 'hidden' : 'flex',
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
            <LuChevronLeft className="text-xl" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex items-center justify-center gap-x-2"
            disabled={
              isFetching || selectedIndex + defaultpageSize === viewedPosts?.pagination.total_count
            }
            onClick={handleScrollNext}
          >
            {isFetching && pageNumber !== 1 ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LuChevronRight className="text-xl" />
            )}
          </Button>
        </section>
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className={cn('w-full', isInsideModal ? 'sm:max-w-[45vw]' : 'sm:max-w-[66vw]')}
        setApi={setApi}
      >
        <CarouselContent>
          {listProduct.map((product, index) => (
            <CarouselItem
              className={cn('', isInsideModal ? 'lg:basis-1/2' : 'md:basis-1/2 lg:basis-1/3')}
              key={product?.id || index}
            >
              <ProductCard isShowAuthor={false} product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ViewedPosts;
