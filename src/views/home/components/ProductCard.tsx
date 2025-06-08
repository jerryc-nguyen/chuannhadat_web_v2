import { services } from '@api/services';
import BedRoomIcon from '@assets/icons/badroom-icon';
import BadRoomIcon from '@assets/icons/bedroom-icon';
import { cn } from '@common/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card';
import Spinner from '@components/ui/spinner';
import { YoutubePlayerAction } from '@components/youtube-player-modal';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import Link from 'next/link';
import { isLoadingModal, selectedPostId } from '../../post-detail/states/modalPostDetailAtoms';
import styles from '../styles/ProductCard.module.scss';
import CardAuthor from './CardAuthor';
import CardImageCarousel from './CardImageCarousel/CardImageCarousel';
import LoadingProductCard from './LoadingProductCard';
type ProductCardProps = {
  product: A;
  isShowAuthor?: boolean;
  className?: string;
  isShowVideoYoutube?: boolean;
};
export default function ProductCard({
  product,
  isShowAuthor = true,
  className,
  isShowVideoYoutube = true,
}: ProductCardProps) {
  const queryClient = useQueryClient();

  const [postId, setSelectedPostId] = useAtom(selectedPostId);
  const isLoadingCardProduct = useAtomValue(isLoadingModal);

  const openModalPostDetail = async (postId: string) => {
    setSelectedPostId(postId);
    await queryClient.prefetchQuery({
      queryKey: ['get-detail-post', postId],
      queryFn: () => services.posts.getDetailPost(postId),
    });
  };

  const isShowInfoPrice = product?.formatted_price || product?.formatted_price_per_m2;
  if (!product || product?.images?.length == 0) {
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
        <CardImageCarousel
          handleClickCardImage={() => {
            openModalPostDetail(product.uid);
          }}
          product={product}
        />
      </CardContent>
      <CardFooter className="flex-col p-0 pt-4">
        <div className="w-full text-secondary">
          {product.bus_cat_type.replace('căn hộ chung cư', 'căn hộ')}
          {!!product.project && (
            <>
              <span> · </span>
              <a href={product.project.url} className="hover:underline">
                <b>{product.project.name}</b>
              </a>
            </>
          )}
        </div>

        <Link className="invisible opacity-0" href={product.detail_path} />
        <h3
          onClick={() => openModalPostDetail(product.uid)}
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
