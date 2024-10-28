'use client';
import React from 'react';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import useResizeImage from '@hooks/useResizeImage';
import { TPhoto } from '@models';

const ImageCarousel: React.FC<{ images: TPhoto[]; onClick: (id: number) => void }> = ({ images, onClick }) => {
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
    <div className="relative w-full max-w-lg mx-auto">
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
                  className="object-cover w-full h-full"
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
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer"
        />
        <CarouselNext
          onClick={handleNextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer"
        />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md">
          {current + 1} / {images.length}
        </div>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
