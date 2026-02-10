import { IProductList } from '@common/types/product';
import Image from 'next/image';
import { MapPin, BedDouble, Bath } from 'lucide-react';

interface ProductListItemProps {
  product: IProductList;
}

export function ProductListItem({ product }: ProductListItemProps) {
  return (
    <div className="flex gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={product.featured_image_url}
          alt={product.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Product Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {product.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{product.short_location_name}</span>
        </div>

        {/* Price, Area, Bed/Bath */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700">
          {/* Price */}
          <span className="font-semibold text-primary">{product.formatted_price}</span>
          
          {/* Area */}
          <span className="text-gray-500">•</span>
          <span>{product.formatted_area}</span>

          {/* Bedrooms */}
          {product.bedrooms_count > 0 && (
            <>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-1">
                <BedDouble className="h-3 w-3" />
                <span>{product.bedrooms_count}</span>
              </div>
            </>
          )}

          {/* Bathrooms */}
          {product.bathrooms_count && product.bathrooms_count > 0 && (
            <>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-1">
                <Bath className="h-3 w-3" />
                <span>{product.bathrooms_count}</span>
              </div>
            </>
          )}
        </div>

        {/* Category & Published date */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{product.bus_cat_type}</span>
          {product.formatted_publish_at && (
            <>
              <span>•</span>
              <span>{product.formatted_publish_at}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
