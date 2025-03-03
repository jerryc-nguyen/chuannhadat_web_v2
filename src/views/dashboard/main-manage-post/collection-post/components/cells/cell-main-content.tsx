'use client';

import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import Spinner from '@components/ui/spinner';
import { ColumnDef } from '@tanstack/react-table';
import { isLoadingModal, selectedPostId } from '@views/post-detail/states/modalPostDetailAtoms';
import { useAtomValue } from 'jotai';
import { Maximize2, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import hideOnFrontendReasonConstant from '../../constant/hide_on_frontend_reason';
import { Product } from '../../data/schemas';
import {
  ButtonDelete,
  ButtonRefresh,
  ButtonUpVip,
  CheckboxAutoRefresh,
  SwitchButtonToggleShowOnFrontEnd,
} from '../actions';
import { BlockImageProduct } from './BlockImageProduct';
import { TitleTriggerOpenProductDetail } from './TitleTriggerOpenProductDetail';
import { BlockWarnHiddenPost } from './BlockWarnHiddenPost';
import { BlockCheckHiddenReason } from './BlockCheckHiddenReason';

export const CellMainContent: ColumnDef<Product>['cell'] = ({ row }) => {
  const hide_on_frontend_reason = row.original.hide_on_frontend_reason;

  const images = row.original.images;
  const imageUrl = images?.[0]?.url || '/default-image.jpg';

  const images_count = row.original.images_count;
  const visible = row.original.visible;

  const title = row.original.title;
  const productUid = row.original.uid;
  const formatted_price = row.original.formatted_price;
  const formatted_area = row.original.formatted_area;
  const formatted_price_per_m2 = row.original.formatted_price_per_m2;
  const formatted_kt = row.original.formatted_kt;

  const formatted_bussiness_category = row.original.formatted_bussiness_category;
  const short_location_name = row.original.short_location_name;

  const productId = row.original.id;
  const adsType = row.original.ads_type;
  const auto_refresh_product = row.original.auto_refresh_product;

  return (
    <div className={`container ${row.original.ads_type}`}>
      <BlockCheckHiddenReason hide_on_frontend_reason={hide_on_frontend_reason} />
      <div className="flex min-h-[180px] w-full gap-8 overflow-hidden rounded-lg md:rounded-xl lg:flex-row lg:items-center">
        <ImageProduct
          title={title}
          imageUrl={imageUrl}
          images_count={images_count}
          visible={visible}
          productId={productId}
          productUid={productUid}
        />
        <div className="flex h-full flex-1 flex-col">
          <div className="mb-2">
            <TitleTriggerOpenProductDetail title={title} product={row.original} />
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

            <CheckboxAutoRefresh
              productId={productId}
              auto_refresh_product={auto_refresh_product}
            />
          </div>
        </div>
        <div className="col-span-2 flex h-full flex-col space-y-1">
          <div className="flex flex-col">
            <ButtonRefresh productId={productId} />

            <Link href={`/dashboard/manage-post/${productUid}`}>
              <Button variant="outline" size="sm" className="mb-2 h-8 justify-start gap-2">
                <SquarePen size={16} /> <span className="text-sm">Cập nhật tin</span>
              </Button>
            </Link>

            <Separator className="h-[1px]" />

            <ButtonDelete productId={productId} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageProduct = ({
  imageUrl,
  images_count,
  title,
  visible,
  productId,
  productUid,
}: {
  imageUrl: string;
  images_count: number;
  title: string;
  visible: boolean;
  productId: string;
  productUid: string;
}) => {
  const postId = useAtomValue(selectedPostId);
  const isLoadingCardProduct = useAtomValue(isLoadingModal);

  return (
    <div className="group inline-flex h-full flex-col gap-3 rounded-lg">
      <BlockImageProduct images_count={images_count} imageUrl={imageUrl} title={title} />
      <SwitchButtonToggleShowOnFrontEnd productId={productId} visible={visible} />

      {isLoadingCardProduct && postId === productUid && (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-x-2 rounded-md bg-white/80 text-primary_color">
          <div role="status">
            <Spinner />
          </div>
          <span className="font-medium">Đang tải...</span>
        </div>
      )}
    </div>
  );
};
