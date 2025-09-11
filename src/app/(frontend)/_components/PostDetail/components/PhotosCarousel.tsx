import { AspectRatio } from '@components/ui/AspectRatio';
import { YoutubePlayerAction } from '@frontend/features/media/youtube-player-modal';
import useResizeImage from '@common/hooks/useResizeImage';
import { IProductDetail } from '../../CategoryPage/mobile/searchs/type';
import ImageCarousel from '@components/mobile-ui/ImageCarousel';
import { useState } from 'react';
import { CircleChevronLeft as GoArrowLeft, CircleChevronRight as GoArrowRight } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/plugins/counter.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

export default function PhotosCarousel({ product }: { product: IProductDetail }) {
  const { buildThumbnailUrl } = useResizeImage();

  const onClickImage = (indexImage: number) => {
    setIndexImageActive(indexImage);
    setIsOpenSlideImage(true);
  };

  const [openSlideImage, setIsOpenSlideImage] = useState<boolean>(false);
  const [indexImageActive, setIndexImageActive] = useState<number>(0);

  return (
    <div className="flex-center relative flex-col gap-4 bg-white">
      <YoutubePlayerAction
        isDisplay={Boolean(product?.youtube_url)}
        youtube_url={product?.youtube_url as string}
      />
      {product?.images && product?.images.length > 1 ? (
        <ImageCarousel images={product.images} onClick={onClickImage} />
      ) : (
        <AspectRatio ratio={16 / 9}>
          <img
            className="h-full w-full object-cover"
            src={buildThumbnailUrl({
              imageUrl: product.images[0].url,
            })}
            suppressHydrationWarning
            alt={(product as IProductDetail)?.description}
          />
        </AspectRatio>
      )}
      {openSlideImage && (
        <Lightbox
          className="mobile-lightbox-images"
          open={openSlideImage}
          controller={{ closeOnPullDown: true }}
          index={indexImageActive}
          close={() => setIsOpenSlideImage(false)}
          styles={{
            root: { pointerEvents: 'auto' },
            slide: {
              maxWidth: '100%',
              maxHeight: '100%',
              overflow: 'hidden',
            },
          }}
          slides={product?.images.map((item) => ({
            src: item.url,
            thumbnail: buildThumbnailUrl({
              imageUrl: item.url,
              width: 100,
              ratio: 16 / 9,
            }),
          }))}
          thumbnails={{
            vignette: false,
            padding: 0,
            border: 0,
            height: 50, // Reduced height for better fit on small screens
            width: 70, // Reduced width for better fit on small screens
            imageFit: 'cover',
            hidden: false,
            showToggle: false,
          }}
          counter={{ container: { style: { top: '0' } } }}
          render={{
            iconPrev: () => <GoArrowLeft className="text-2xl opacity-50 hover:opacity-100" />,
            iconNext: () => <GoArrowRight className="text-2xl opacity-50 hover:opacity-100" />,
          }}
          plugins={[Thumbnails, Zoom, Counter]}
        />
      )}
    </div>
  );
}
