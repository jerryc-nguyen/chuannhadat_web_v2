import React from 'react';
import ImageCard from '../ImageCard';
import ButtonSave from '../ButtonSave';
import { Carousel, CarouselContent, type CarouselApi } from '@components/ui/carousel';
import ImageSliderAction from '../ImageSliderAction';
import { EmblaCarouselType } from 'embla-carousel';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import useResizeImage from '@hooks/useResizeImage';
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
    setSlidesInView((slidesInView) => {
      if (slidesInView.length === imageSliderApi.slideNodes().length) {
        imageSliderApi.off('slidesInView', updateSlidesInView);
      }
      const inView = imageSliderApi.slidesInView().filter((index) => !slidesInView.includes(index));
      return slidesInView.concat(inView);
    });
  }, []);

  // https://stackoverflow.com/a/50227675
  const preloadImages = React.useCallback(
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
  return (
    <section className={styles.card_img_carousel}>
      {product.images_count < 2 ? (
        <>
          {
            product.images[0] && (
              <ImageCard
                key={product.images[0].id}
                countImages={product.images_count}
                item={product.images[0]}
                onClick={handleClickCardImage}
              />)
          }
          <ButtonSave postUid={product.uid} />
        </>
      ) : (
        <Carousel
          opts={{ loop: true }}
          setApi={setImageSliderApi}
          plugins={[Fade()]}
          className="card-content_carousel w-full"
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
