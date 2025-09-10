'use client';

import { useIsMobile } from '@hooks';
import useModals from '@mobile/modals/hooks';
import PostDetailMobile from '@mobile/post-detail/PostDetailMobile';
import AuthorInfo from '@mobile/post-detail/components/AuthorInfo';
import { ProductDetailTitleBts } from '@mobile/searchs/ProductCardV2';
import useModalPostDetail from '@frontend/PostDetail/hooks/useModalPostDetail';
import { Product } from '../../data/schemas';
import { cn } from '@common/utils';

export const TitleTriggerOpenProductDetail = ({
  title,
  product,
  className,
}: {
  title: string;
  product: Product;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const { openModal } = useModals();
  const { handleOpenModal } = useModalPostDetail();

  const openModalPostDetail = async () => {
    if (isMobile) {
      openModal({
        name: title,
        title: <ProductDetailTitleBts product={product} />,
        content: <PostDetailMobile productUid={product.uid} />,
        maxHeightPercent: 0.95,
        footer: <AuthorInfo />,
        headerHeight: 74.59,
        footerHeight: 74.59,
        // pushToPath: product.detail_path,
      });
    } else {
      await handleOpenModal(product.uid);
    }
  };

  return (
    <span
      className={cn("mb-2 md:mb-3 cursor-pointer text-16 font-semibold hover:underline", className)}
      onClick={openModalPostDetail}
    >
      <span className="c-ads_color">{title}</span>
    </span>
  );
};
