import useResizeImage from '@hooks/useResizeImage';
import React from 'react';
import styles from './index.module.scss';
import { IoImage } from 'react-icons/io5';

import { LuLoader2 } from 'react-icons/lu';
import { IProductSummary } from '@views/post-detail/type';
import { AspectRatio } from '@components/ui/AspectRatio';

import useModalPostDetail from '@views/post-detail/hooks/useModalPostDetail';

type RelatedProductCardProps = {
  product: IProductSummary;
};

const RelatedProductCard: React.FC<RelatedProductCardProps> = ({ product }) => {
  const DEFAULT_THUMB_IMAGE =
    'https://images.chuannhadat.com/images/placeholders/list-item-placeholder.png';
  const { buildThumbnailUrl } = useResizeImage();
  const { handleOpenModal, postIdModal, isLoadingDataModal, postDetailDataModal } =
    useModalPostDetail();

  const handleViewDetailPost = (product: IProductSummary) => {
    handleOpenModal(product.uid);
  };

  return (
    <div className={styles.related_product_card}>
      <h3
        onClick={() => handleViewDetailPost(product)}
        className="cursor-pointer mb-4 line-clamp-2 h-[40px] text-ellipsis text-sm font-semibold text-dark-gray">
        {product?.title}
      </h3>
      <div className="card-content">
        <div className="card-content_image relative cursor-pointer [grid-area:image]">
          <AspectRatio className="h-full overflow-hidden rounded-md">
            <img
              className="h-full object-cover transition-all hover:scale-125"
              src={buildThumbnailUrl({
                imageUrl: product?.featured_image_url || DEFAULT_THUMB_IMAGE,
              })}
              alt={product?.title}
            />
          </AspectRatio>
          <div className="card-content_thumb rounded-full bg-black/50 px-2">
            <IoImage size={15} className="text-md text-white" />
            <span className="text-lg text-white">{product?.images_count}</span>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden [grid-area:price]">
          <span className="text-xs font-bold">{product?.formatted_price}</span>
          <span className="text-secondary">{product?.formatted_price_per_m2}</span>
        </div>
        <div className="flex flex-col overflow-hidden [grid-area:square]">
          <span className="text-xs font-bold [grid-area:price]">{product?.formatted_area}</span>
          <span className="text-secondary [grid-area:price]">{product?.formatted_kt}</span>
        </div>
        {product?.bedrooms_count && (
          <span className="font-bold [grid-area:bedroom]">{product?.bedrooms_count} pn</span>
        )}
        {product?.bathrooms_count && (
          <span className="font-bold [grid-area:wc]">{product?.bathrooms_count} pt</span>
        )}
        <p className="text-sm text-secondary [grid-area:address]">
          {product?.short_location_name}
        </p>
      </div>
      {isLoadingDataModal && postIdModal === product.uid && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 text-white">
          <LuLoader2 className="mr-2 h-8 w-8 animate-spin" />
          Đang tải
        </div>
      )}
    </div>
  );
};

export default RelatedProductCard;
