'use client';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import useResizeImage from '@hooks/useResizeImage';
import { TPhoto } from '@models';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import React from 'react';
type ImageCarouselProps = {
  images: TPhoto[];
  onClick: (id: number) => void;
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onClick }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const { buildThumbnailUrl } = useResizeImage();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    // Set initial count and current slide
    const updateCurrent = () => setCurrent(api.selectedScrollSnap());
    api.on('select', updateCurrent);
    updateCurrent();

    return () => {
      api.off('select', updateCurrent);
    };
  }, [api]);

  const handlePrevSlide = (): void => {
    api?.scrollPrev();
  };

  const handleNextSlide = (): void => {
    api?.scrollNext();
  };

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <Carousel setApi={setApi} className="w-full" loop={true}>
        <CarouselContent>
          {images.map((image: TPhoto, index: number) => (
            <CarouselItem
              onClick={() => onClick(index)}
              key={image.id || index}
              className={`transition-opacity duration-500 ${index === current ? 'opacity-100' : 'opacity-0'}`}
            >
              <AspectRatio.Root ratio={16 / 9}>
                <img
                  className="h-full w-full object-cover"
                  src={buildThumbnailUrl({
                    imageUrl: image.url,
                  })}
                  alt={`Slide ${index + 1}`}
                />
              </AspectRatio.Root>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-full bg-white p-2 shadow-md"
        />
        <CarouselNext
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-full bg-white p-2 shadow-md"
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-white px-4 py-1 shadow-md">
          {current + 1} / {images.length}
        </div>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
