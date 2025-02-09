import { useState } from 'react';
import { AspectRatio } from '@components/ui/AspectRatio';
import useResizeImage from '@hooks/useResizeImage';
import { IProductDetail } from '@mobile/searchs/type';
import ImageCarousel from '@mobile/ui/ImageCarousel';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';

export default function PhotosCarousel({ product }: { product: IProductDetail }) {
  const { buildThumbnailUrl } = useResizeImage();

  const onClickImage = (indexImage: number) => {
    setIndexImageActive(indexImage);
    setIsOpenSlideImage(true);
  };

  const [openSlideImage, setIsOpenSlideImage] = useState<boolean>(false);
  const [indexImageActive, setIndexImageActive] = useState<number>(0);

  return (
    <div className="flex flex-col gap-4 bg-white">
      {product?.images && product?.images.length > 1 ? (
        <ImageCarousel images={product.images} onClick={onClickImage} />
      ) : (
        <AspectRatio ratio={16 / 9}>
          <img
            className="h-full w-full object-cover"
            src={buildThumbnailUrl({
              imageUrl: product.images[0].url,
            })}
            alt={(product as IProductDetail)?.description}
          />
        </AspectRatio>
      )}

      {openSlideImage && product?.images_count > 1 && (
        <Lightbox
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
          }))}
          thumbnails={{
            vignette: false,
            padding: 0,
            border: 0,
            height: 50, // Reduced height for better fit on small screens
            width: 70, // Reduced width for better fit on small screens
            imageFit: 'cover',
            hidden: product?.images && product?.images.length <= 1,
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
