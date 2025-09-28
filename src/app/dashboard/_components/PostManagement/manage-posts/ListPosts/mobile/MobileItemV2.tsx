import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { SquarePen, MapPin } from 'lucide-react';
import Link from 'next/link';
import {
  ButtonDelete,
  ButtonRefresh,
  ButtonUpVip,
  CheckboxAutoRefresh,
  SwitchButtonToggleShowOnFrontEnd,
} from '../components/actions';
import { BlockAdsType } from '../components/cells/BlockAdsType';
import { BlockCheckHiddenReason } from '../components/cells/BlockCheckHiddenReason';
import { BlockImageProduct } from '../components/cells/BlockImageProduct';
import { BlockWarnHiddenPost } from '../components/cells/BlockWarnHiddenPost';
import { TitleTriggerOpenProductDetail } from '../components/cells/TitleTriggerOpenProductDetail';
import { Product } from '../data/schemas';
import { DASHBOARD_ROUTES } from '@common/router';

interface MobileItemV2Props {
  product: Product;
}

export function MobileItemV2({ product }: MobileItemV2Props) {
  const {
    id,
    uid: productUid,
    title,
    images,
    images_count,
    visible,
    hide_on_frontend_reason,
    formatted_price,
    formatted_area,
    formatted_price_per_m2,
    short_location_name,
    ads_type: adsType,
    expires_after_days,
    auto_refresh_product,
    formatted_published_at,
    detail_path,
  } = product;

  const imageUrl = images?.[0]?.url || '/default-image.jpg';

  return (
    <div className={`bg-white rounded-lg shadow-sm border mb-3 overflow-hidden ${adsType}`}>
      {/* Hidden Reason Warning */}
      <BlockCheckHiddenReason hide_on_frontend_reason={hide_on_frontend_reason} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Link
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
            href={detail_path}
          >
            #{id}
          </Link>
          <BlockWarnHiddenPost visible={visible} isMobile />
        </div>
        <div className="text-xs text-gray-500">
          {formatted_published_at}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Image and Title */}
        <div className="flex gap-3 mb-3">
          <div className="flex-shrink-0">
            <BlockImageProduct
              images_count={images_count}
              imageUrl={imageUrl}
              title={title}
              className="h-16 w-16 rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <TitleTriggerOpenProductDetail
              title={title}
              product={product}
              className="text-sm font-medium line-clamp-2 mb-1"
            />
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{short_location_name || '--'}</span>
            </div>
            <BlockAdsType
              ads_type={adsType}
              expires_after_days={expires_after_days}
              className="mb-0"
            />
          </div>
        </div>

        {/* Property Info */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium text-green-600">{formatted_price || '--'}</div>
            <div className="text-gray-500">Giá</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium">{formatted_area || '--'}</div>
            <div className="text-gray-500">Diện tích</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium">{formatted_price_per_m2 || '--'}</div>
            <div className="text-gray-500">Đơn giá</div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="p-4 pt-3">
        <div className="flex gap-2 mb-3">
          <ButtonUpVip productId={id} adsType={adsType} />
          <ButtonRefresh productId={id} />
          <Link href={`${DASHBOARD_ROUTES.posts.edit}/${productUid}`}>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <SquarePen size={14} />
              <span className="text-xs">Sửa</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <CheckboxAutoRefresh
            productId={id}
            auto_refresh_product={auto_refresh_product}
          />
          <div className="flex items-center gap-2">
            <SwitchButtonToggleShowOnFrontEnd productId={id} visible={visible} />
            <ButtonDelete productId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
