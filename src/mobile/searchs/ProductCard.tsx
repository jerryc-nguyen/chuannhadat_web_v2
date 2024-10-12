import React from 'react';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import { IoImage } from 'react-icons/io5';
import useResizeImage from '@hooks/useResizeImage';
import { IProduct } from './type';
import useModals from '@mobile/modals/hooks';
import PostDetailMobile from '../post-detail/PostDetailMobile ';
import Image from 'next/image';
import AuthorInfo from '@mobile/post-detail/components/AuthorInfo';

const styles: A = {
  imagesCountWrapper: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    height: 35,
  },
  imagesCount: {
    backgroundColor: 'rgba(0,0,0,.3)',
    display: 'flex',
    borderRadius: 20,
  },
};

const ProductDetailTitleBts = ({ product }: { product: A }) => {
  return (
    <div className="flex flex-grow items-center justify-between mr-4">
      <div className="flex flex-col items-start justify-center">
        <span className={`text-xl font-semibold`}>{product?.formatted_price}</span>
        <span className="text-sm text-gray">{product?.formatted_price_per_m2}</span>
      </div>

      <div className="flex flex-col items-start justify-center">
        <span className={`text-xl font-semibold`}>{product?.formatted_area}</span>
        <span className="text-sm text-gray">{product?.formatted_kt || '...'}</span>
      </div>

      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center justify-center">
          <img src="https://spaces.chuannhadat.com/icons/bed_icon.svg" width="16" alt="" />
          <span className="ml-2">{product?.bedrooms_count}</span>
        </div>

        <div className="flex items-center justify-center">
          <img src="https://spaces.chuannhadat.com/icons/bath_icon.svg" width="16" alt="" />
          <span className="ml-2">{product?.bathrooms_count}</span>
        </div>
      </div>
    </div>)
}
export default function ProductCard({ product }: { product: IProduct }) {
  const { buildThumbnailUrl } = useResizeImage();

  const { openModal } = useModals();
  const handleShowDetailHouse = () => {
    openModal({
      name: product.title,
      title: <ProductDetailTitleBts product={product} />,
      content: <PostDetailMobile productUid={product.uid} />,
      maxHeightPercent: 0.95,
      footer: <AuthorInfo />,
      headerHeight: 74.59,
      footerHeight: 67
    });
  };

  const genImageSrc = React.useMemo(() => {
    return buildThumbnailUrl({
      imageUrl: product?.featured_image_url,
    });
  }, [buildThumbnailUrl, product?.featured_image_url]);

  return (
    <div className="my-4 overflow-hidden bg-white shadow-lg dark:bg-slate-800">
      <AspectRatio.Root ratio={16 / 9}>
        <Image
          src={genImageSrc}
          alt={product?.title}
          fill
          blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mOcWw8AAb8BHjgUU1kAAAAASUVORK5CYII='
          loading='lazy'
          placeholder='blur'
          className="h-full w-full cursor-pointer object-cover"
        />

        <div style={styles.imagesCountWrapper}>
          <div style={styles.imagesCount} className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center justify-start" style={{ marginLeft: 5 }}>
              <IoImage size={20} style={{ color: '#fff' }} />
              <span style={{ color: '#fff', marginLeft: 5 }}>1</span>
            </div>
          </div>
        </div>
      </AspectRatio.Root>

      <div className="p-4">
        <h3
          className="mb-2 cursor-pointer font-bold text-slate-600 hover:text-blue-500"
          onClick={handleShowDetailHouse}
        >
          {product?.title}
        </h3>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-start justify-center">
            <span className="text-xl font-semibold">{product?.formatted_price}</span>
            <span className="text-sm text-slate-600">{product?.formatted_price_per_m2}</span>
          </div>

          <div className="flex flex-col items-start justify-center">
            <span className="text-xl font-semibold">{product?.formatted_area}</span>
            <span className="text-sm text-slate-600">{product?.formatted_kt || '...'}</span>
          </div>

          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center justify-center">
              <img src="https://spaces.chuannhadat.com/icons/bed_icon.svg" width="16" alt="" />
              <span className="ml-2">{product?.bedrooms_count}</span>
            </div>

            <div className="flex items-center justify-center">
              <img src="https://spaces.chuannhadat.com/icons/bath_icon.svg" width="16" alt="" />
              <span className="ml-2">{product?.bathrooms_count}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-row items-center justify-between">
          <div className="text-slate-600">{product?.short_location_name}</div>
          <div className="text-slate-600">{product?.formatted_publish_at}</div>
        </div>
      </div>
    </div>
  );
}
