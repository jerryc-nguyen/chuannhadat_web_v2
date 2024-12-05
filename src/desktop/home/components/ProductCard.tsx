import CardAuthor from './CardAuthor';
import { useAtom, useAtomValue } from 'jotai';
import { isLoadingModal, selectedPostId } from '../../post-detail/states/modalPostDetailAtoms';
import { useQueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card';
import { EmblaCarouselType } from 'embla-carousel';
import styles from '../styles/ProductCard.module.scss';
import BadRoomIcon from '@assets/icons/bedroom-icon';
import BedRoomIcon from '@assets/icons/badroom-icon';
import Spinner from '@components/ui/spinner';
import { Carousel, CarouselApi, CarouselContent } from '@components/ui/carousel';
import { cn } from '@common/utils';
import React, { useCallback } from 'react';
import ImageCard from './ImageCard';
import Fade from 'embla-carousel-fade';
import ImageSliderAction from './ImageSliderAction';
import useEmblaCarousel from 'embla-carousel-react';

import ButtonSave from './ButtonSave';
import useResizeImage from '@hooks/useResizeImage';
import LoadingProductCard from './LoadingProductCard';
type ProductCardProps = {
  product: A;
  isShowAuthor?: boolean;
  className?: string;
};
export default function ProductCard({ product, isShowAuthor = true, className }: ProductCardProps) {
  const queryClient = useQueryClient();

  const [imageSliderViewPortRef] = useEmblaCarousel();
  const [imageSliderApi, setImageSliderApi] = React.useState<CarouselApi>();
  const [slidesInView, setSlidesInView] = React.useState<number[]>([]);
  const { buildThumbnailUrl } = useResizeImage();

  const [postId, setSelectedPostId] = useAtom(selectedPostId);
  const isLoadingCardProduct = useAtomValue(isLoadingModal);

  const openModalPostDetail = async (postId: string) => {
    setSelectedPostId(postId);
    await queryClient.prefetchQuery({
      queryKey: ['get-detail-post', postId],
      queryFn: () => services.posts.getDetailPost(postId),
    });
  };

  const updateSlidesInView = React.useCallback((imageSliderApi: EmblaCarouselType) => {
    setSlidesInView((slidesInView) => {
      if (slidesInView.length === imageSliderApi.slideNodes().length) {
        imageSliderApi.off('slidesInView', updateSlidesInView);
      }
      const inView = imageSliderApi.slidesInView().filter((index) => !slidesInView.includes(index));
      return slidesInView.concat(inView);
    });
  }, []);

  // https://stackoverflow.com/a/50227675
  const preloadImages = useCallback(
    (event: A) => {
      if (event.scrollProgress() != 0) {
        return;
      }
      product.images.forEach((picture: A, index: number) => {
        setTimeout(() => {
          const img = new Image();
          img.src = buildThumbnailUrl({ imageUrl: picture.url });
        }, index * 10);
      });
    },
    [buildThumbnailUrl, product?.images],
  );

  React.useEffect(() => {
    if (!imageSliderApi) return;
    updateSlidesInView(imageSliderApi);
    imageSliderApi.on('slidesInView', updateSlidesInView);
    imageSliderApi.on('reInit', updateSlidesInView);
    imageSliderApi.on('select', preloadImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSliderApi, updateSlidesInView]);

  const isShowInfoPrice = product?.formatted_price || product?.formatted_price_per_m2;
  if (!product) {
    return <LoadingProductCard />;
  }
  return (
    <Card
      className={cn(
        styles.card_wrapper,
        'relative h-full overflow-hidden rounded-md p-4',
        className,
      )}
    >
      {isShowAuthor && (
        <CardHeader className="p-0 pb-4">
          <CardAuthor product={product} />
        </CardHeader>
      )}
      <CardContent className="card-content">
        {product.images.length > 0 && (
          <Carousel
            opts={{ loop: true }}
            setApi={setImageSliderApi}
            plugins={[Fade()]}
            className="card-content_carousel w-full"
          >
            <CarouselContent ref={imageSliderViewPortRef} className="ml-0">
              {product.images.map((item: A, index: number) => (
                <ImageCard
                  key={item.id}
                  inView={slidesInView.indexOf(index) > -1}
                  countImages={product.lenght}
                  item={item}
                  detailPath={product.detail_path || ''}
                  index={index}
                  onClick={() => openModalPostDetail(product.uid)}
                />
              ))}
            </CarouselContent>
            <ImageSliderAction api={imageSliderApi} countImages={product.images.length} onClick={() => openModalPostDetail(product.uid)} />
            <ButtonSave postUid={product.uid} />
          </Carousel>
        )}
      </CardContent>
      <CardFooter className="flex-col p-0 pt-4">
        <h3
          onClick={() => openModalPostDetail(product.uid)}
          className="we line-clamp-2 cursor-pointer text-base font-semibold text-primary"
        >
          {product?.title}
        </h3>

        <div className="mt-4 flex w-full justify-between">
          {isShowInfoPrice && (
            <div className="flex flex-col gap-y-1 text-sm">
              <span className="text-base font-bold text-black">{product?.formatted_price}</span>
              <span className="alic text-secondary">{product?.formatted_price_per_m2}</span>
            </div>
          )}
          <div className="flex flex-col gap-y-1 text-sm">
            <span className="text-base font-bold text-black">{product?.formatted_area}</span>
            <span className="italic text-secondary">{product?.formatted_kt || '...'}</span>
          </div>
          <div className="flex flex-col gap-y-1">
            <div className="flex w-fit gap-x-1 rounded-full border px-2 py-1 text-secondary">
              <BedRoomIcon />
              {product?.bedrooms_count && (
                <span className="text-nowrap font-medium leading-5">{product.bedrooms_count}</span>
              )}
            </div>
            <div className="flex w-fit gap-x-1 rounded-full border px-2 py-1 text-secondary">
              <BadRoomIcon />
              {product?.bathrooms_count && (
                <span className="text-nowrap font-medium leading-5">{product.bathrooms_count}</span>
              )}
            </div>
          </div>
        </div>
      </CardFooter>
      {isLoadingCardProduct && postId === product.uid && (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-x-2 rounded-md bg-white/80 text-primary_color">
          <div role="status">
            <Spinner />
          </div>
          <span className="font-medium">Đang tải...</span>
        </div>
      )}
    </Card>
  );
}
