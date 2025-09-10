import { cn } from '@common/utils';
import { Carousel, CarouselContent, type CarouselApi } from '@components/ui/carousel';
import useCleanupEffect from '@hooks/useCleanupEffect';
import useResizeImage from '@hooks/useResizeImage';
import { EmblaCarouselType } from 'embla-carousel';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import React from 'react';
import ButtonSave from '../ButtonSave';
import ImageCard from '../ImageCard';
import ImageSliderAction from '../ImageSliderAction';
import styles from './CardImageCarousel.module.scss';

type CardImageCarouselProps = {
  product: A;
  handleClickCardImage?: () => void;
};

const CardImageCarousel: React.FC<CardImageCarouselProps> = (props) => {
  const { product, handleClickCardImage } = props;
  const [imageSliderViewPortRef] = useEmblaCarousel();
  const [imageSliderApi, setImageSliderApi] = React.useState<CarouselApi>();
  const [slidesInView, setSlidesInView] = React.useState<number[]>([]);
  const { buildThumbnailUrl } = useResizeImage();

  const updateSlidesInView = React.useCallback((imageSliderApi: EmblaCarouselType) => {
    // Get slides that are currently in view but not in our state yet
    const currentSlidesInView = imageSliderApi.slidesInView();

    setSlidesInView((prevSlidesInView) => {
      // If we've already processed all slides, don't update state again
      if (prevSlidesInView.length === imageSliderApi.slideNodes().length) {
        return prevSlidesInView; // Return the same state to prevent re-render
      }

      // Only add slides that aren't already in our state
      const newInView = currentSlidesInView.filter((index) => !prevSlidesInView.includes(index));

      // If no new slides to add, return same state reference to prevent re-render
      if (newInView.length === 0) {
        return prevSlidesInView;
      }

      // Add new slides to the state
      return [...prevSlidesInView, ...newInView];
    });
  }, []);

  // Instead of using setTimeout directly, we'll use it in a safer way
  // within the useCleanupEffect hook to avoid memory leaks
  const preloadImageSafely = React.useCallback(
    (imageUrl: string) => {
      const img = new Image();
      img.src = buildThumbnailUrl({ imageUrl });
    },
    [buildThumbnailUrl],
  );

  // Modified preloadImages callback
  const preloadImages = React.useCallback(
    (event: A) => {
      if (event.scrollProgress() !== 0 || !product?.images?.length) {
        return;
      }

      // We'll handle the actual preloading with timeouts in the useCleanupEffect hook
      product.images.forEach((picture: A) => {
        preloadImageSafely(picture.url);
      });
    },
    [product?.images, preloadImageSafely],
  );

  // Replace React.useEffect with useCleanupEffect
  useCleanupEffect(
    (helpers) => {
      if (!imageSliderApi) return;

      // Set up event handlers
      updateSlidesInView(imageSliderApi);
      imageSliderApi.on('slidesInView', updateSlidesInView);
      imageSliderApi.on('reInit', updateSlidesInView);
      imageSliderApi.on('select', preloadImages);

      // Clean up event handlers
      helpers.addCleanup(() => {
        imageSliderApi.off('slidesInView', updateSlidesInView);
        imageSliderApi.off('reInit', updateSlidesInView);
        imageSliderApi.off('select', preloadImages);
      });
    },
    [imageSliderApi, updateSlidesInView, preloadImages],
  );

  return (
    <section className={styles.card_img_carousel}>
      {product.images_count < 2 ? (
        <>
          {product.images[0] && (
            <ImageCard
              key={product.images[0].id}
              countImages={product.images_count}
              item={product.images[0]}
              onClick={handleClickCardImage}
            />
          )}
          <ButtonSave postUid={product.uid} />
        </>
      ) : (
        <Carousel
          opts={{ loop: true }}
          setApi={setImageSliderApi}
          plugins={[Fade()]}
          className={cn(styles['card-content_carousel'], 'w-full')}
        >
          <CarouselContent ref={imageSliderViewPortRef} className="ml-0">
            {(product.images || []).map((item: A, index: number) => (
              <ImageCard
                key={item.id}
                inView={slidesInView.indexOf(index) > -1}
                countImages={product.images_count}
                item={item}
                index={index}
                onClick={handleClickCardImage}
              />
            ))}
          </CarouselContent>

          <ImageSliderAction
            api={imageSliderApi}
            countImages={product.images.length}
            onClick={handleClickCardImage}
          />
          <ButtonSave postUid={product.uid} />
        </Carousel>
      )}
    </section>
  );
};

export default CardImageCarousel;
