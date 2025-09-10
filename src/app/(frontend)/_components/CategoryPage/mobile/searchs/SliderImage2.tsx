'use client';
import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import useResizeImage from '@hooks/useResizeImage';
import { TPhoto } from '@models';
export default function SliderImage2({ listImg }: { listImg: TPhoto[] }) {
  const { buildThumbnailUrl } = useResizeImage();

  return (
    <>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {listImg.map((img: TPhoto, index: number) => {
            return (
              <CarouselItem key={index}>
                <AspectRatio.Root ratio={16 / 9}>
                  <img
                    alt="image"
                    className="Image rounded-md"
                    src={buildThumbnailUrl({
                      imageUrl: img.url,
                    })}
                  />
                </AspectRatio.Root>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </>
  );
}
