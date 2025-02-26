import { useReactTable } from '@tanstack/react-table';
import { Product } from '../data/schemas';
import { BlockImageProduct } from '../components/cells/BlockImageProduct';
import { TitleTriggerOpenProductDetail } from '../components/cells/TitleTriggerOpenProductDetail';
import { BlockWarnHiddenPost } from '../components/cells/BlockWarnHiddenPost';
import {
  ButtonDelete,
  ButtonRefresh,
  ButtonUpVip,
  CheckboxAutoRefresh,
  SwitchButtonToggleShowOnFrontEnd,
} from '../components/actions';
import { Separator } from '@components/ui/separator';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { Maximize2, SquarePen } from 'lucide-react';
import { BlockCheckHiddenReason } from '../components/cells/BlockCheckHiddenReason';
import { BlockAdsType } from '../components/cells/BlockAdsType';

type Props<T> = {
  table: T extends object ? ReturnType<typeof useReactTable<T>> : never;
  contentEmpty?: React.ReactNode;
};

export const ListPostMobile = <T extends Product>({ table, contentEmpty }: Props<T>) => {
  const rows = table.getRowModel().rows;

  if (!rows?.length) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-500">{contentEmpty}</div>
    );
  }

  return (
    <>
      {rows.map((row, key) => {
        const product = row.original;
        return <SinglePost key={key} product={product} />;
      })}
    </>
  );
};

interface SinglePostProps {
  key: number;
  product: Product;
}

function SinglePost({ key, product }: SinglePostProps) {
  const hide_on_frontend_reason = product.hide_on_frontend_reason;

  const images = product.images;
  const imageUrl = images?.[0]?.url || '/default-image.jpg';

  const images_count = product.images_count;
  const visible = product.visible;

  const title = product.title;
  const productUid = product.uid;
  const formatted_price = product.formatted_price;
  const formatted_area = product.formatted_area;
  const formatted_price_per_m2 = product.formatted_price_per_m2;
  const formatted_kt = product.formatted_kt;

  const formatted_bussiness_category = product.formatted_bussiness_category;
  const short_location_name = product.short_location_name;

  const productId = product.id;
  const adsType = product.ads_type;
  const auto_refresh_product = product.auto_refresh_product;

  const expires_after_days = product.expires_after_days;

  const formatted_published_at = product.formatted_published_at;

  return (
    <div
      className={`c-productCard overflow-hidden bg-white shadow-lg ${product.ads_type} px-4 pb-4`}
    >
      <div className="flex w-full items-center justify-end gap-2">
        <div className="flex flex-row gap-1 text-xs">
          <span className="font-medium">Ngày làm mới:</span>
          <span className="text-secondary">{formatted_published_at}</span>
        </div>
        <BlockWarnHiddenPost visible={visible} isMobile />
        <BlockPostId product={product} />
      </div>

      <BlockCheckHiddenReason hide_on_frontend_reason={hide_on_frontend_reason} />
      <div className="grid grid-cols-4">
        <div>
          <BlockImageProduct
            images_count={images_count}
            imageUrl={imageUrl}
            title={title}
            className="h-20 w-full"
          />
        </div>
        <div className="col-span-3 flex flex-col gap-1 pl-3">
          <TitleTriggerOpenProductDetail title={title} product={product} className="text-sm mb-0" />
          <BlockAdsType
            ads_type={adsType}
            expires_after_days={expires_after_days}
            className="mb-2 flex-row"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-1 text-xs mt-2">
        <span className="rounded-sm border p-1 font-medium">{formatted_price || '--'}</span>
        <span className="rounded-sm border p-1 font-medium">{formatted_area || '--'}</span>
        <span className="rounded-sm border p-1 font-medium">{formatted_price_per_m2 || '--'}</span>
        <span className="flex gap-1 rounded-sm border p-1 font-medium">
          <Maximize2 size={14} strokeWidth={1} />
          {formatted_kt || '--'}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 text-xs mt-1">
        <span className="rounded-sm border p-1">{formatted_bussiness_category || '--'}</span>
        <span className="rounded-sm border p-1">{short_location_name || '--'}</span>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <ButtonUpVip productId={productId} adsType={adsType} />
        <ButtonRefresh productId={productId} />

        <CheckboxAutoRefresh productId={productId} auto_refresh_product={auto_refresh_product} />
        <Link href={`/dashboard/manage-post/${productUid}`}>
          <Button variant="outline" size="sm" className="mb-2 h-8 justify-start gap-2">
            <SquarePen size={16} /> <span className="text-sm">Sửa</span>
          </Button>
        </Link>
        <SwitchButtonToggleShowOnFrontEnd productId={productId} visible={visible} />

        <ButtonDelete productId={productId} />
      </div>
    </div>
  );
}

const BlockPostId = ({ product }: { product: Product }) => {
  const id = product.id;
  const detail_path = product.detail_path;
  return (
    <div className="flex justify-end gap-1 py-2 text-xs">
      <span className="font-medium">Mã tin:</span>
      <Link className="cursor-pointer text-blue-600 hover:text-blue-900" href={`${detail_path}`}>
        #{id}
      </Link>
    </div>
  );
};
