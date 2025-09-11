import BedRoomIcon from '@assets/icons/badroom-icon';
import BadRoomIcon from '@assets/icons/bedroom-icon';
import { YoutubePlayerAction } from '@frontend/features/media/youtube-player-modal';
import { useIsInVerticalCenterZone } from '@common/hooks/useIsInVerticalCenterZone';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import AuthorInfo from '@frontend/PostDetail/mobile/post-detail/components/AuthorInfo';
import CardAuthor from '@frontend/CategoryPage/components/CardAuthor';
import ThumbsCarousel from '@frontend/CategoryPage/components/ThumbsCarousel/ThumbsCarousel';
import BusCatType from '@frontend/CategoryPage/components/product-card/BusCatType';
import { useRef } from 'react';
import PostDetailMobile from '@frontend/PostDetail/mobile/post-detail/PostDetailMobile';
import { IProductData } from './type';

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
export default function ProductCard({ product, productIndex = 0 }: { product: IProductData; productIndex?: number }) {
  const { openModal } = useModals();
  const divRef = useRef<HTMLDivElement | null>(null);
  const isInCenter = useIsInVerticalCenterZone(divRef as React.RefObject<HTMLElement>);

  const showDetailPostModal = (e?: A) => {
    openModal({
      name: product.title,
      title: <ProductDetailTitleBts product={product} />,
      content: <PostDetailMobile productUid={product.uid} />,
      maxHeightPercent: 0.95,
      footer: <AuthorInfo />,
      headerHeight: 74.59,
      footerHeight: 74.59,
      supportPushState: false,
    });

    e?.preventDefault();
    e?.stopPropagation();
    e?.nativeEvent.stopImmediatePropagation();

    return false;
  };

  return (
    <div
      className={`c-productCard overflow-hidden bg-white shadow-lg ${product.ads_type} ${isInCenter ? 'card-in-view-center' : ''}`}
      ref={divRef}
    >
      <div className="p-4">
        <CardAuthor product={product} isMobile={true} />
      </div>
      <div className="flex-center relative">
        <YoutubePlayerAction youtube_url={product.youtube_url} />
        {product.images && product.images.length > 0 && (
          <ThumbsCarousel
            product={product}
            isEager={productIndex < 4} // ✅ Mobile: first 4 products are above fold
            productIndex={productIndex}
            handleClickCardImage={showDetailPostModal}
          />
        )}
      </div>
      <div className="p-4">
        {product.bus_cat_type && <BusCatType busCatType={product.bus_cat_type} project={'project' in product ? product.project : undefined} />}
        <a
          onClick={showDetailPostModal}
          href={`/post/${product.slug}`}
          className="c-ads_color mb-2 cursor-pointer font-bold text-secondary"
        >
          {product?.title}{' '}
        </a>
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
