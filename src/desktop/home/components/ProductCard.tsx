/* eslint-disable @next/next/no-img-element */
import { IoImage } from 'react-icons/io5';
import useResizeImage from '@hooks/useResizeImage';
import CardAuthor from './CardAuthor';
import { useAtom, useAtomValue } from 'jotai';
import { isLoadingModal, selectedPostId } from '../../post-detail/states/modalPostDetailAtoms';
import { useQueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card';
import { AspectRatio } from '@components/ui/AspectRatio';
import Image from 'next/image';
import BadRoomIcon from '@assets/icons/bedroom-icon';
import BedRoomIcon from '@assets/icons/badroom-icon';
import Spinner from '@components/ui/spinner';

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

const DEFAULT_THUMB_IMAGE =
  'https://images.chuannhadat.com/images/placeholders/list-item-placeholder.png';
type ProductCardProps = {
  product: A;
  isShowAuthor?: boolean;
};
export default function ProductCard({ product, isShowAuthor = true }: ProductCardProps) {
  const { buildThumbnailUrl } = useResizeImage();
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

  return (
    <Card className="post-list_item relative h-full rounded-md p-4">
      {isShowAuthor && (
        <CardHeader className="p-0 pb-4">
          <CardAuthor product={product} />
        </CardHeader>
      )}
      <CardContent className="p-0">
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md bg-muted">
          <Image
            src={buildThumbnailUrl({
              imageUrl: product?.featured_image_url || DEFAULT_THUMB_IMAGE,
            })}
            alt="Image post"
            fill
            loading='lazy'
            className="h-full w-full cursor-pointer object-cover transition-all hover:scale-125"
          />
          <div style={styles.imagesCountWrapper}>
            <div style={styles.imagesCount} className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center justify-start" style={{ marginLeft: 5 }}>
                <IoImage size={20} style={{ color: '#fff' }} />
                <span style={{ color: '#fff', marginLeft: 5 }}>{product?.images_count}</span>
              </div>
            </div>
          </div>
        </AspectRatio>
      </CardContent>
      <CardFooter className="flex-col p-0 pt-4">
        <h3
          onClick={() => openModalPostDetail(product.uid)}
          className="limit-2-line cursor-pointer text-base font-semibold capitalize text-[#16192C] hover:text-primary_color"
        >
          {product?.title}
        </h3>

        <div className="mt-4 flex w-full justify-between">
          <div className="flex flex-col gap-y-1 text-sm">
            <span className="font-bold text-[#505780]">{product?.formatted_price}</span>
            <span className="italic text-muted-foreground">{product?.formatted_area}</span>
          </div>
          <div className="flex flex-col gap-y-1 text-sm">
            <span className="font-bold text-[#505780]">{product?.formatted_price_per_m2}</span>
            <span className="italic text-muted-foreground">{product?.formatted_kt || '...'}</span>
          </div>
          <div className="flex flex-col gap-y-1">
            <div className="flex w-fit gap-x-1 rounded-full border bg-primary_color/10 px-2 py-1 text-primary_color">
              <BedRoomIcon />
              {product?.bedrooms_count && (
                <span className="text-nowrap font-medium leading-5">{product.bedrooms_count}</span>
              )}
            </div>
            <div className="flex w-fit gap-x-1 rounded-full border bg-primary_color/10 px-2 py-1 text-primary_color">
              <BadRoomIcon />
              {product?.bathrooms_count && (
                <span className="text-nowrap font-medium leading-5">{product.bathrooms_count}</span>
              )}
            </div>
          </div>
        </div>
      </CardFooter>
      {isLoadingCardProduct && postId === product.uid && (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-x-2 rounded-md bg-white/80 text-primary_color">
          <div role="status">
            <Spinner />
          </div>
          <span className="font-medium">Đang tải...</span>
        </div>
      )}
    </Card>
  );
}
