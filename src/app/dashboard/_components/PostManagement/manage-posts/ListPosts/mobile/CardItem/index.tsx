import { Separator } from '@components/ui/separator';
import {
  SwitchButtonToggleShowOnFrontEnd,
} from '../../components/actions';
import { BlockCheckHiddenReason } from '../../components/cells/BlockCheckHiddenReason';
import { BlockWarnHiddenPost } from '../../components/cells/BlockWarnHiddenPost';
import { Product } from '../../data/schemas';
import ProductInfo from '@app/dashboard/_components/PostManagement/manage-posts/ListPosts/mobile/CardItem/ProductInfo';
import { Actions } from './Actions';
import { ItemProps } from '@app/dashboard/_components/PostManagement/manage-posts/ListPosts/mobile/CardItem/ItemProps';
import { MapPin } from 'lucide-react';
import { ProductDetailTitleBts } from '@frontend/CategoryPage/mobile/searchs/ProductCardV2';
import PostDetailMobile from '@frontend/PostDetail/PostDetailMobile';
import AuthorInfo from '@frontend/PostDetail/mobile/components/AuthorInfo';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { BlockAdsType } from './BlockAdsType';

interface CardItemProps {
  product: Product;
}

export function CardItem({ product }: CardItemProps) {
  const { openModal } = useModals();
  const {
    id,
    uid: productUid,
    visible,
    hide_on_frontend_reason,
    ads_type: adsType,
    auto_refresh_product,
    formatted_published_at
  } = product;

  const onOpenDetailModal = (product: Product) => {
    openModal({
      name: product?.title,
      title: <ProductDetailTitleBts product={product} />,
      content: <PostDetailMobile productUid={product.uid} />,
      maxHeightPercent: 0.95,
      footer: <AuthorInfo />,
      headerHeight: 74.59,
      footerHeight: 74.59,
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border mb-3 overflow-hidden ${adsType}`}>
      {/* Hidden Reason Warning */}
      <BlockCheckHiddenReason hide_on_frontend_reason={hide_on_frontend_reason} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">

          <SwitchButtonToggleShowOnFrontEnd productId={id} visible={visible} />

          <BlockWarnHiddenPost visible={visible} isMobile />
        </div>

        <div className="flex items-center gap-4">

          <div className="text-gray-500">
            {formatted_published_at}
          </div>
        </div>
      </div>

      <div className="p-4 pb-0 flex items-center gap-2 ">
        <BlockAdsType ads_type={adsType} expires_after_days={product?.expires_after_days} />

        <span>
          Mã tin:
          &nbsp;
          <a
            className="font-medium text-blue-600 hover:text-blue-800"
            href={product?.detail_path}
          >
            #{product?.id}
          </a>
        </span>
      </div>

      <ProductInfo product={product} onOpenDetailModal={onOpenDetailModal} />

      <div className="px-4 pb-1">
        <ItemProps items={product?.item_props || []} />
      </div>

      <div className="px-4 pb-2 flex items-center gap-2 text-sm text-gray-500">
        <MapPin /> {product?.full_address}
      </div>

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
