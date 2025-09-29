import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { SquarePen } from 'lucide-react';
import Link from 'next/link';
import {
  ButtonDelete,
  ButtonRefresh,
  ButtonUpVip,
  CheckboxAutoRefresh,
  SwitchButtonToggleShowOnFrontEnd,
} from '../../components/actions';
import { BlockCheckHiddenReason } from '../../components/cells/BlockCheckHiddenReason';
import { BlockWarnHiddenPost } from '../../components/cells/BlockWarnHiddenPost';
import { Product } from '../../data/schemas';
import { DASHBOARD_ROUTES } from '@common/router';
import ProductInfo from '@app/dashboard/_components/PostManagement/manage-posts/ListPosts/mobile/CardItem/ProductInfo';

interface CardItemProps {
  product: Product;
}

export function CardItem({ product }: CardItemProps) {
  const {
    id,
    uid: productUid,
    visible,
    hide_on_frontend_reason,
    ads_type: adsType,
    auto_refresh_product,
    formatted_published_at,
    detail_path,
  } = product;

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

      <ProductInfo product={product} />

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
