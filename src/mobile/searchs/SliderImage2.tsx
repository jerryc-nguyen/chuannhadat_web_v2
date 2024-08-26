'use client';
import React, { useState } from 'react';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Image } from './type';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import useResizeImage from '@hooks/useResizeImage';
export default function SliderImage2({ listImg }: { listImg: Image[] }) {
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
          {listImg.map((img: Image, index: number) => {
            return (
              <CarouselItem key={index}>
                <AspectRatio.Root ratio={16 / 9}>
                  <img
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
