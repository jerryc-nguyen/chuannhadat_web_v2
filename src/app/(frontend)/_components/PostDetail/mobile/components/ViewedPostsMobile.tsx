import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@components/ui/carousel';
import { useViewedPosts } from '@frontend/features/main-nav-rights/FavoriteIcon/hooks/useViewedPosts';
import ProductCard from '@frontend/CategoryPage/mobile/searchs/ProductCard';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ViewedPostsMobileProps = {
  productUid: string;
};

const defaultPageSize = 1;
const ViewedPostsMobile: React.FC<ViewedPostsMobileProps> = ({ productUid }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const isScrollNext = React.useRef<boolean>(false);

  const { listProduct, isFetching, pageNumber, setPageNumber, pagination } = useViewedPosts({
    productUid,
    defaultPageSize,
  });

  React.useEffect(() => {
    if (listProduct && isScrollNext.current) {
      setTimeout(() => {
        api?.scrollNext();
        isScrollNext.current = false;
      }, 0.2);
    }
  }, [listProduct.length]);

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

  React.useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
  }, [api, onSelect]);
  if (pagination?.total_count === 0) return null;
  return (
    <section className={cn('flex w-full flex-col gap-1 overflow-hidden border bg-white p-4')}>
      <div
        className={cn(
          'flex items-center justify-between',
          pagination?.total_count === defaultPageSize ? 'hidden' : 'flex',
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
            <ChevronLeft className="text-xl" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex items-center justify-center gap-x-2 rounded-full"
            disabled={
              isFetching || selectedIndex + defaultPageSize === pagination?.total_count
            }
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
              <ProductCard product={product.product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ViewedPostsMobile;
