import React from 'react';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import { IoImage } from 'react-icons/io5';
import useResizeImage from '@hooks/useResizeImage';
import { IProduct } from './type';
import useModals from '@mobile/modals/hooks';
import PostDetailMobile from '../post-detail/PostDetailMobile';
import Image from 'next/image';
import AuthorInfo from '@mobile/post-detail/components/AuthorInfo';
import Link from 'next/link';
import ButtonSave from '@desktop/home/components/ButtonSave';
import LoadingProductCard from '@desktop/home/components/LoadingProductCard';
import BedRoomIcon from '@assets/icons/badroom-icon';
import BadRoomIcon from '@assets/icons/bedroom-icon';
import CardAuthor from '@desktop/home/components/CardAuthor';
import CardImageCarousel from '@desktop/home/components/CardImageCarousel/CardImageCarousel';

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

export const ProductDetailTitleBts = ({ product }: { product: A }) => {
  return (
    <div className="mr-4 flex flex-grow items-center justify-between">
      <div className="flex flex-col items-start justify-center">
        <span className={`text-xl font-semibold`}>{product?.formatted_price}</span>
        <span className="text-gray text-sm">{product?.formatted_price_per_m2}</span>
      </div>

      <div className="flex flex-col items-start justify-center">
        <span className={`text-xl font-semibold`}>{product?.formatted_area}</span>
        <span className="text-gray text-sm">{product?.formatted_kt || '...'}</span>
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
  );
};
export default function ProductCard({ product }: { product: IProduct }) {
  const { buildThumbnailUrl } = useResizeImage();
  const { openModal } = useModals();

  const showDetailPostModal = (e: A) => {
    e.preventDefault();
    openModal({
      name: product.title,
      title: <ProductDetailTitleBts product={product} />,
      content: <PostDetailMobile productUid={product.uid} />,
      maxHeightPercent: 0.95,
      footer: <AuthorInfo />,
      headerHeight: 74.59,
      footerHeight: 74.59,
      pushToPath: `/post/${product.slug}`,
    });
  };

  const genImageSrc = React.useMemo(() => {
    return buildThumbnailUrl({
      imageUrl: product?.featured_image_url,
    });
  }, [buildThumbnailUrl, product?.featured_image_url]);

  if (!product) {
    return <LoadingProductCard />;
  }

  return (
    <div className="c-productCard overflow-hidden bg-white shadow-lg">
      <div className="p-4">
        <CardAuthor product={product} isMobile={true} />
      </div>
      <CardImageCarousel product={product} />
      <div className="p-4">
        <div className="w-full text-secondary">{product.bus_cat_type}</div>

        <Link
          onClick={showDetailPostModal}
          href={`/post/${product.slug}`}
          className="mb-2 cursor-pointer font-bold text-secondary hover:text-blue-500"
        >
          {product?.title}{' '}
        </Link>
      </div>
      <div className="flex w-full justify-between px-4 pb-4">
        <div className="flex flex-col gap-y-1 text-sm">
          <span className="text-base font-bold text-black">{product?.formatted_price}</span>
          <span className="alic text-secondary">{product?.formatted_price_per_m2}</span>
        </div>

        <div className="flex flex-col gap-y-1 text-sm">
          <span className="text-base font-bold text-black">{product?.formatted_area}</span>
          <span className="italic text-secondary">{product?.formatted_kt || '...'}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="flex w-fit gap-x-2 rounded-full px-2 text-secondary">
            <BedRoomIcon />
            {product?.bedrooms_count && (
              <span className="text-nowrap font-medium leading-5">{product.bedrooms_count}</span>
            )}
          </div>
          <div className="flex w-fit gap-x-2 rounded-full px-2 text-secondary">
            <BadRoomIcon />
            {product?.bathrooms_count && (
              <span className="text-nowrap font-medium leading-5">{product.bathrooms_count}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
