// Removed unused services import
import BedRoomIcon from '@assets/icons/badroom-icon';
import BadRoomIcon from '@assets/icons/bedroom-icon';
import { cn } from '@common/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card';
import Spinner from '@components/ui/spinner';
import { YoutubePlayerAction } from '@components/features/media/youtube-player-modal';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import { isLoadingModal, selectedPostId } from '@frontend/PostDetail/states/modalPostDetailAtoms';
import useModalPostDetail from '@frontend/PostDetail/hooks/useModalPostDetail';
import styles from '../styles/ProductCard.module.scss';
import CardAuthor from './CardAuthor';
import ThumbsCarousel from './ThumbsCarousel';
import LoadingProductCard from './LoadingProductCard';
import BusCatType from './product-card/BusCatType';

type ProductCardProps = {
  product: A;
  isShowAuthor?: boolean;
  className?: string;
  isShowVideoYoutube?: boolean;
  isFirstProduct?: boolean;
  productIndex?: number;
};

export default function ProductCard({
  product,
  isShowAuthor = true,
  className,
  isShowVideoYoutube = true,
  isFirstProduct = false,
  productIndex = 0,
}: ProductCardProps) {
  // ✅ Use dedicated hook for modal management
  const { handleOpenModal } = useModalPostDetail();

  // ✅ Only keep atoms that are actually used for UI state
  const postId = useAtomValue(selectedPostId);
  const isLoadingCardProduct = useAtomValue(isLoadingModal);

  const isShowInfoPrice = product?.formatted_price || product?.formatted_price_per_m2;
  if (!product) {
    return <LoadingProductCard />;
  }

  return (
    <Card
      className={cn(
        styles.card_wrapper,
        'relative h-full overflow-hidden rounded-md p-4',
        product.ads_type,
        className,
      )}
    >
      {isShowAuthor && (
        <CardHeader className="p-0 pb-4">
          <CardAuthor product={product} />
        </CardHeader>
      )}
      <CardContent className={cn(styles.card_content, 'flex-center relative')}>
        <YoutubePlayerAction
          youtube_url={product.youtube_url}
          isDisplay={Boolean(product.youtube_url && isShowVideoYoutube)}
        />
        <ThumbsCarousel
          handleClickCardImage={() => {
            handleOpenModal(product.uid);
          }}
          product={product}
          isEager={isFirstProduct}
          productIndex={productIndex}
        />
      </CardContent>
      <CardFooter className="flex-col p-0 pt-4">
        <BusCatType busCatType={product.bus_cat_type} project={product.project} />

        <Link className="invisible opacity-0" href={product.detail_path} />
        <h3
          onClick={() => handleOpenModal(product.uid)}
          className="c-ads_color mt-2 line-clamp-2 w-full cursor-pointer font-semibold text-primary"
        >
          {product?.title}
        </h3>
        <div className="mt-4 flex w-full justify-between">
          {isShowInfoPrice && (
            <div className="flex flex-col gap-y-1 text-sm">
              <span className="text-base font-bold text-black">{product?.formatted_price}</span>
              <span className="alic text-secondary">{product?.formatted_price_per_m2}</span>
            </div>
          )}
          <div className="flex flex-col gap-y-1 text-sm">
            <span className="text-base font-bold text-black">{product?.formatted_area}</span>
            <span className="italic text-secondary">{product?.formatted_kt || '...'}</span>
          </div>
          <div className="flex flex-col gap-y-1">
            <div className="flex w-fit gap-x-1 rounded-full border px-2 py-1 text-secondary">
              <BedRoomIcon />
              {product?.bedrooms_count && (
                <span className="text-nowrap font-medium leading-5">{product.bedrooms_count}</span>
              )}
            </div>
            <div className="flex w-fit gap-x-1 rounded-full border px-2 py-1 text-secondary">
              <BadRoomIcon />
              {product?.bathrooms_count && (
                <span className="text-nowrap font-medium leading-5">{product.bathrooms_count}</span>
              )}
            </div>
          </div>
        </div>
        {!isShowAuthor && (
          <div className="w-full text-secondary">{product?.short_location_name}</div>
        )}
      </CardFooter>

      {
        isLoadingCardProduct && postId === product.uid && (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-x-2 rounded-md bg-white/80 text-primary_color">
            <div role="status">
              <Spinner />
            </div>
            <span className="font-medium">Đang tải...</span>
          </div>
        )
      }
    </Card >
  );
}
