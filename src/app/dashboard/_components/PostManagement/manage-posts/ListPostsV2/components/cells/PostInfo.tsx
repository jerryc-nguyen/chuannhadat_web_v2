'use client';

import { Maximize2 } from 'lucide-react';
import { ButtonUpVip, CheckboxAutoRefresh } from '../../../ListPostsV2/components/actions';
import { ManageProductList } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/schemas/ManageProductListSchema';
import { TitleTriggerOpenProductDetail } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/cells/TitleTriggerOpenProductDetail';
import { BlockWarnHiddenPost } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/components/cells/BlockWarnHiddenPost';

export type PostInfoProps = {
  product: ManageProductList;
};

export const PostInfo = ({ product }: PostInfoProps) => {
  const {
    title,
    visible,
    formatted_price,
    formatted_area,
    formatted_price_per_m2,
    formatted_kt,
    formatted_bussiness_category,
    short_location_name,
    id: productId,
    ads_type: adsType,
    auto_refresh_product,
  } = product;

  return (
    <div className={`flex flex-col ${product.ads_type}`} >
      <div className="mb-2">
        <TitleTriggerOpenProductDetail title={title} product={product} />
        <BlockWarnHiddenPost visible={visible} />
      </div>
      <div className="mb-2 flex flex-wrap gap-5">
        <span className="text-sm font-medium">{formatted_price || '--'}</span>
        <span className="text-sm font-medium">·</span>
        <span className="text-sm font-medium">{formatted_area || '--'}</span>
        <span className="text-sm font-medium">·</span>
        <span className="text-sm font-medium">{formatted_price_per_m2 || '--'}</span>
        <span className="text-sm font-medium">·</span>
        <span className="flex gap-2 text-sm font-medium">
          <Maximize2 size={16} strokeWidth={1} />
          {formatted_kt || '--'}
        </span>
      </div>
      <div className="mb-2 flex flex-wrap gap-5">
        <span className="text-sm">{formatted_bussiness_category || '--'}</span>
        <span className="text-sm">·</span>
        <span className="text-sm">{short_location_name || '--'}</span>
      </div>

      <div className="flex gap-4">
        <ButtonUpVip productId={productId} adsType={adsType} />
        <CheckboxAutoRefresh productId={productId} auto_refresh_product={auto_refresh_product} />
      </div>
    </div >
  );
};
