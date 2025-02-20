import { DEFAULT_THUMB_IMAGE } from '@common/constants';
import BlurImage from '@components/BlurImage';
import { AspectRatio } from '@components/ui/AspectRatio';
import { CarouselItem } from '@components/ui/carousel';
import useResizeImage from '@hooks/useResizeImage';
import React from 'react';

type ImageCardProps = {
  countImages: number;
  item: A;
  inView?: boolean;
  index?: number;
  onClick?: () => void;
};

const ImageCard: React.FC<ImageCardProps> = (props) => {
  const { countImages, inView, item, onClick } = props;
  const { buildThumbnailUrl } = useResizeImage();
  if (countImages < 2)
    return (
      <AspectRatio ratio={16 / 9} className="bg-muted md:rounded-md" onClick={onClick}>
        <BlurImage
          src={buildThumbnailUrl({
            imageUrl: item.url || DEFAULT_THUMB_IMAGE,
          })}
          alt="Image post"
          fill
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mOcWw8AAb8BHjgUU1kAAAAASUVORK5CYII="
          loading="lazy"
          placeholder="blur"
          className="h-full w-full cursor-pointer object-cover transition-all hover:scale-125"
          onClick={(e) => e.preventDefault()}
        />
      </AspectRatio>
    );
  return (
    <CarouselItem className="card_item aspect-[16/9] pl-0" key={item.id}>
      <AspectRatio ratio={16 / 9} className="md:rounded-md">
        <BlurImage
          src={buildThumbnailUrl({
            imageUrl: inView ? item.url : DEFAULT_THUMB_IMAGE,
          })}
          alt="Image post"
          fill
          blurDataURL="L5BD+ENZDj8~~mV[D,oy9_IWMf.5"
          loading="lazy"
          placeholder="blur"
          className="card-image h-full w-full cursor-pointer object-cover transition-all hover:scale-125"
          onClick={onClick}
        />
      </AspectRatio>
    </CarouselItem>
  );
};

export default ImageCard;
