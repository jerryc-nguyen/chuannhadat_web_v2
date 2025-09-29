import { Separator } from '@components/ui/separator';
import {
  SwitchButtonToggleShowOnFrontEnd,
} from '../../components/actions';
import { BlockCheckHiddenReason } from '../../components/cells/BlockCheckHiddenReason';
import { BlockWarnHiddenPost } from '../../components/cells/BlockWarnHiddenPost';
import { Product } from '../../data/schemas';
import ProductInfo from '@app/dashboard/_components/PostManagement/manage-posts/ListPosts/mobile/CardItem/ProductInfo';
import { Actions } from './Actions';

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
    formatted_published_at
  } = product;

  return (
    <div className={`bg-white rounded-lg shadow-sm border mb-3 overflow-hidden ${adsType}`}>
      {/* Hidden Reason Warning */}
      <BlockCheckHiddenReason hide_on_frontend_reason={hide_on_frontend_reason} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          {/* <Link
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
            href={detail_path}
          >
            #{id}
          </Link> */}
          <SwitchButtonToggleShowOnFrontEnd productId={id} visible={visible} />

          <BlockWarnHiddenPost visible={visible} isMobile />
        </div>
        <div className="text-xs text-gray-500">
          {formatted_published_at}
        </div>
      </div>

      <ProductInfo product={product} />

      <Separator />

      <Actions
        productId={id}
        productUid={productUid}
        adsType={adsType}
        autoRefreshProduct={auto_refresh_product}
      />
    </div>
  );
}
