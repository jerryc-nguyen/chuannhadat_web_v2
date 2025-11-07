'use client';

import { BlockImageProduct } from './BlockImageProduct';
import { SwitchButtonToggleShowOnFrontEnd } from '../actions';
import Spinner from '@components/ui/spinner';
import { useAtomValue } from 'jotai';
import { selectedPostId, isLoadingModal } from '@frontend/PostDetail/states/modalPostDetailAtoms';
import { ManageProductList } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/schemas/ManageProductListSchema';

export type FeaturedImageProps = {
  product: ManageProductList;
};

export default function FeaturedImage({ product }: FeaturedImageProps) {
  const {
    images_count,
    featured_image_url: imageUrl,
    title,
    uid: productUid,
    visible,
    id: productId,
  } = product;
  const postId = useAtomValue(selectedPostId);
  const isLoadingCardProduct = useAtomValue(isLoadingModal);

  return (
    <div className="group inline-flex w-full flex-col gap-3 rounded-lg">
      <BlockImageProduct images_count={images_count} imageUrl={imageUrl} title={title} />
      <SwitchButtonToggleShowOnFrontEnd productId={productId} visible={visible} />

      {isLoadingCardProduct && postId === productUid && (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-x-2 rounded-md bg-white/80 text-primary_color">
          <div role="status">
            <Spinner />
          </div>
          <span className="font-medium">Đang tải...</span>
        </div>
      )}
    </div>
  );
};
