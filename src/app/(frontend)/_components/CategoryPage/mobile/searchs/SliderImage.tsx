'use client';
import React, { useState } from 'react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import * as AspectRatio from '@radix-ui/react-aspect-ratio';

import useResizeImage from '@common/hooks/useResizeImage';
import { TPhoto } from '@common/models';
export default function SliderImage({ listImg }: { listImg: TPhoto[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { buildThumbnailUrl } = useResizeImage();
  return (
    <>
      <Swiper
        style={
          {
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties
        }
        loop={true}
        spaceBetween={10}
        navigation={false}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {listImg.map((img: TPhoto, index: number) => {
          return (
            <SwiperSlide key={index}>
              <AspectRatio.Root ratio={16 / 9}>
                <img
                  alt="swipper image"
                  className="Image rounded-md"
                  src={buildThumbnailUrl({
                    imageUrl: img.url,
                  })}
                />
              </AspectRatio.Root>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <Swiper
        onSwiper={(swiper: A) => setThumbsSwiper(swiper)}
        loop={true}
        spaceBetween={10}
        slidesPerView={2}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {listImg.map((img, index) => {
          return (
            <SwiperSlide key={index}>
              <AspectRatio.Root ratio={16 / 9}>
                <img
                  src={buildThumbnailUrl({
                    imageUrl: img.url,
                  })}
                  className="Image rounded-md"
                />
              </AspectRatio.Root>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
