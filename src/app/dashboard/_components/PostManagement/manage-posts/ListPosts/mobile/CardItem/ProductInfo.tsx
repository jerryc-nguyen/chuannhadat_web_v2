import { AspectRatio } from '@components/ui/AspectRatio';
import useResizeImage from '@common/hooks/useResizeImage';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { featureProductImage } from '@common/productHelpers';
import { Product } from '../../data/schemas';

type RelatedProductCardProps = {
  product: Product;
  onOpenDetailModal?: (product: Product) => void;
};

const ProductInfo: React.FC<RelatedProductCardProps> = ({ product, onOpenDetailModal }) => {
  const DEFAULT_THUMB_IMAGE =
    'https://images.chuannhadat.com/images/placeholders/list-item-placeholder.png';
  const { buildThumbnailUrl } = useResizeImage();

  const handleViewDetailPost = (product: Product) => {
    onOpenDetailModal?.(product);
  };

  return (
    <div className="p-4">
      <h3
        onClick={() => handleViewDetailPost(product)}
        className="text-dark-gray mb-4 text-lg cursor-pointer text-base font-semibold"
      >
        {product?.title}
      </h3>
      <div
        className="grid gap-x-[1em] grid-cols-[33.33%_33.33%_33.33%] grid-rows-3"
        style={{
          gridTemplateAreas: `
            'image price square'
            'image bedroom wc'
            'image phap_ly phap_ly'
          `
        }}
      >
        <div className="relative cursor-pointer [grid-area:image]">
          <AspectRatio className="overflow-hidden rounded-md">
            <img
              className="h-full object-cover border border-gray-200 rounded-md"
              src={buildThumbnailUrl({
                imageUrl: featureProductImage(product) || DEFAULT_THUMB_IMAGE,
                width: 150,
                ratio: 1,
              })}
              alt={product?.title}
            />
            <div className="absolute bottom-[10px] right-[10px] h-fit flex gap-x-1 items-center rounded-full bg-black/50 px-2">
              <ImageIcon size={15} className="text-md text-white" />
              <span className="text-lg text-white w-fit">{product?.images_count}</span>
            </div>
          </AspectRatio>

        </div>

        <div className="flex flex-col overflow-hidden [grid-area:price]">
          <span className="text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full">{product?.formatted_price}</span>
        </div>

        <div className="flex flex-col overflow-hidden [grid-area:square]">
          <span className="text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full">{product?.formatted_area}</span>
        </div>

        {/* Bedroom area */}
        {product?.bedrooms_count && product.bedrooms_count > 0 ? (
          <div className="[grid-area:bedroom]">
            <span className="text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full">{product.bedrooms_count} pn</span>
          </div>
        ) : <div className="[grid-area:bedroom]"></div>}

        {/* Bathroom area */}
        {product?.bathrooms_count && product.bathrooms_count > 0 ? (
          <div className="[grid-area:wc]">
            <span className="text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full">{product.bathrooms_count} pt</span>
          </div>
        ) : <div className="[grid-area:wc]"></div>}

        <p className="text-base text-secondary whitespace-nowrap w-full [grid-area:phap_ly]">{product?.formatted_phap_ly}</p>
      </div>
      <div className="flex gap-2 mt-4 overflow-x-scroll whitespace-nowrap">
        {product?.item_props.map((item) => (
          <span key={item} className="inline-flex items-center px-2 py-1 font-medium bg-gray-100 text-gray-700 rounded-full">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
