import { cn } from '@common/utils';
import { AspectRatio } from '@components/ui/AspectRatio';
import useResizeImage from '@hooks/useResizeImage';
import useModalPostDetail from '@views/post-detail/hooks/useModalPostDetail';
import { IProductSummary } from '@views/post-detail/type';
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import styles from './index.module.scss';
import { featureProductImage } from '@common/productHelpers';

type RelatedProductCardProps = {
  product: IProductSummary;
};

const RelatedProductCard: React.FC<RelatedProductCardProps> = ({ product }) => {
  const DEFAULT_THUMB_IMAGE =
    'https://images.chuannhadat.com/images/placeholders/list-item-placeholder.png';
  const { buildThumbnailUrl } = useResizeImage();
  const { handleOpenModal, postIdModal, isLoadingDataModal } = useModalPostDetail();

  const handleViewDetailPost = (product: IProductSummary) => {
    handleOpenModal(product.uid);
  };

  return (
    <div className={styles.related_product_card}>
      <h3
        onClick={() => handleViewDetailPost(product)}
        className="text-dark-gray mb-4 line-clamp-2 h-[40px] cursor-pointer text-ellipsis text-sm font-semibold"
      >
        {product?.title}
      </h3>
      <div className={styles.card_content}>
        <div className="card-content_image relative cursor-pointer [grid-area:image]">
          <AspectRatio className="h-full overflow-hidden rounded-md">
            <img
              className="h-full object-cover transition-all hover:scale-125"
              src={buildThumbnailUrl({
                imageUrl: featureProductImage(product) || DEFAULT_THUMB_IMAGE,
                width: 140,
              })}
              alt={product?.title}
            />
          </AspectRatio>
          <div className={cn(styles['card-content_thumb'], 'rounded-full bg-black/50 px-2')}>
            <ImageIcon size={15} className="text-md text-white" />
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

        {/* Bedroom area */}
        {product?.bedrooms_count && product.bedrooms_count > 0 ? (
          <div className="[grid-area:bedroom]">
            <span className="font-bold">{product.bedrooms_count} pn</span>
          </div>
        ) : <div className="[grid-area:bedroom]"></div>}

        {/* Bathroom area */}
        {product?.bathrooms_count && product.bathrooms_count > 0 ? (
          <div className="[grid-area:wc]">
            <span className="font-bold">{product.bathrooms_count} pt</span>
          </div>
        ) : <div className="[grid-area:wc]"></div>}

        <p className="text-sm text-secondary [grid-area:address]">{product?.short_location_name}</p>
      </div>
      {isLoadingDataModal && postIdModal === product.uid && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 text-white">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          Đang tải
        </div>
      )}
    </div>
  );
};

export default RelatedProductCard;
