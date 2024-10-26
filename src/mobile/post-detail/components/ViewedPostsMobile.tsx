import { services } from '@api/services';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@components/ui/carousel';
import ProductCard from '@mobile/searchs/ProductCard';
import { IProduct, IProductDetail } from '@mobile/searchs/type';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

type ViewedPostsMobileProps = {
  productUid: string;
};

const defaultpageSize = 1;
const ViewedPostsMobile: React.FC<ViewedPostsMobileProps> = ({ productUid }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [listProduct, setListProduct] = React.useState<(IProductDetail | undefined)[]>([undefined]);
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

  React.useEffect(() => {
    if (listProduct && isScrollNext.current) {
      setTimeout(() => {
        api?.scrollNext();
        isScrollNext.current = false;
      }, 0.2);
    }
  }, [listProduct.length]);

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

  React.useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
  }, [api, onSelect]);
  if (viewedPosts?.pagination.total_count === 0) return null;
  return (
    <section className={cn('flex w-full flex-col gap-1 overflow-hidden border bg-white p-4')}>
      <div
        className={cn(
          'flex items-center justify-between',
          viewedPosts?.pagination.total_count === defaultpageSize ? 'hidden' : 'flex',
        )}
      >
        <h3 className="text-2xl font-semibold">Tin vừa xem</h3>
        <section className="flex gap-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={isFetching || !prevBtnEnabled}
            onClick={handleScrollPrevious}
            className="rounded-full"
          >
            <LuChevronLeft className="text-xl" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex items-center justify-center gap-x-2 rounded-full"
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
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {listProduct.map((product, index) => (
            <CarouselItem key={product?.id || index}>
              <ProductCard product={product as unknown as IProduct} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ViewedPostsMobile;
