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
const DEFAULT_THUMB_IMAGE =
  'https://images.chuannhadat.com/product-images/23421/B%C3%A1n-Nh%C3%A0-m%E1%BA%B7t-ph%E1%BB%91-%C4%90%C6%B0%E1%BB%9Dng-Th%E1%BA%A1nh-L%E1%BB%99c-41-Qu%E1%BA%ADn-12--Di%E1%BB%87n-t%C3%ADch-396m2_c98722_big.jpg?crop=true&height=270&width=480';

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
          className="object-cover w-full h-full transition-all cursor-pointer hover:scale-125"
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
          className="object-cover w-full h-full transition-all cursor-pointer card-image hover:scale-125"
          onClick={onClick}
        />
      </AspectRatio>
    </CarouselItem>
  );
};

export default ImageCard;
