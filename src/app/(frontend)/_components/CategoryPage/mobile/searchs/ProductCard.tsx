import React from 'react';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import { Image as IoImage } from 'lucide-react';
import useResizeImage from '@common/hooks/useResizeImage';
import { IProductData } from './type';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import PostDetailMobile from '@frontend/PostDetail/mobile/post-detail/PostDetailMobile';
import Image from 'next/image';
import AuthorInfo from '@frontend/PostDetail/mobile/post-detail/components/AuthorInfo';
import Link from 'next/link';
import ButtonSave from '@app/(frontend)/_components/features/product-detail-actions/save-post/ButtonSave';
import LoadingProductCard from '@frontend/CategoryPage/components/LoadingProductCard';

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
export default function ProductCard({ product }: { product: IProductData }) {
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
      imageUrl: product?.featured_image_url || '',
    });
  }, [buildThumbnailUrl, product?.featured_image_url]);

  if (!product) {
    return <LoadingProductCard />;
  }

  return (
    <div className={`my-4 overflow-hidden bg-white shadow-lg ${product.ads_type}`}>
      <AspectRatio.Root ratio={16 / 9}>
        <Image
          src={genImageSrc}
          alt={product?.title}
          fill
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mOcWw8AAb8BHjgUU1kAAAAASUVORK5CYII="
          loading="lazy"
          placeholder="blur"
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
        <ButtonSave postUid={product.uid} />
      </AspectRatio.Root>

      <div className="p-4">
        <Link
          onClick={showDetailPostModal}
          href={`/post/${product.slug}`}
          className="mb-2 cursor-pointer font-bold text-secondary hover:underline c-ads_color"
        >
          {product?.title}{' '}
        </Link>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-start justify-center">
            <span className="text-xl font-semibold">{product?.formatted_price}</span>
            <span className="text-sm text-secondary">{product?.formatted_price_per_m2}</span>
          </div>

          <div className="flex flex-col items-start justify-center">
            <span className="text-xl font-semibold">{product?.formatted_area}</span>
            <span className="text-sm text-secondary">{product?.formatted_kt || '...'}</span>
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
          <div className="text-secondary">{product?.short_location_name}</div>
          <div className="text-secondary">{product?.formatted_publish_at}</div>
        </div>
      </div>
    </div>
  );
}
