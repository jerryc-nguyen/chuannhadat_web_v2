import { AspectRatio } from '@components/ui/AspectRatio';
import { CarouselItem } from '@components/ui/carousel';
import useResizeImage from '@hooks/useResizeImage';
import Image from 'next/image';
import React from 'react';

type ImageCardProps = {
  countImages: number;
  item: A;
  inView?: boolean;
  index?: number;
  onClick?: () => void;
};
const DEFAULT_THUMB_IMAGE =
  'https://images.chuannhadat.com/images/placeholders/list-item-placeholder.png';

const ImageCard: React.FC<ImageCardProps> = (props) => {
  const { countImages, inView, item, onClick } = props;
  const { buildThumbnailUrl } = useResizeImage();
  if (countImages < 2)
    return (
      <AspectRatio ratio={16 / 9} className="bg-muted md:rounded-md" onClick={onClick}>
        <Image
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
      <AspectRatio ratio={16 / 9} className="bg-muted md:rounded-md">
        {/* <Link href={detailPath} onClick={(e) => e.preventDefault()}> */}
        <Image
          src={buildThumbnailUrl({
            imageUrl: inView ? item.url : DEFAULT_THUMB_IMAGE,
          })}
          alt="Image post"
          fill
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mOcWw8AAb8BHjgUU1kAAAAASUVORK5CYII="
          loading="lazy"
          placeholder="blur"
          className="card-image h-full w-full cursor-pointer object-cover transition-all"
          onClick={onClick}
        />
      </AspectRatio>
    </CarouselItem>
  );
};

export default ImageCard;
