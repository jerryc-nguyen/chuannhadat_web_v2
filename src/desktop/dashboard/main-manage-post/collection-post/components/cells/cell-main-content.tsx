'use client';

import { services } from '@api/services';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import Spinner from '@components/ui/spinner';
import { isLoadingModal, selectedPostId } from '@desktop/post-detail/states/modalPostDetailAtoms';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useAtom, useAtomValue } from 'jotai';
import { ImageIcon, Maximize2, SquarePen, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
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
import { useIsMobile } from '@hooks';
import useModals from '@mobile/modals/hooks';
import PostDetailMobile from '@mobile/post-detail/PostDetailMobile';
import AuthorInfo from '@mobile/post-detail/components/AuthorInfo';
import { ProductDetailTitleBts } from '@mobile/searchs/ProductCardV2';

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
    <div className="container">
      {hide_on_frontend_reason ? (
        <div className="mb-4 flex w-full overflow-hidden rounded-lg border border-[#9f3a38] bg-[#fff6f6] p-4 md:rounded-xl lg:flex-row lg:items-center">
          <span className="text-sm text-[#9f3a38]">
            {hideOnFrontendReasonConstant
              .find((item) => item.value === hide_on_frontend_reason)
              ?.content.map((line, index) => (
                <Fragment key={index}>
                  {line.trim()}
                  <br />
                </Fragment>
              ))}
          </span>
        </div>
      ) : (
        <></>
      )}
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
            <TitleTriggerOpenProductDetail title={title} visible={visible} product={row.original} />
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

          <div className="flex gap-16">
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
      <div className="relative h-36 w-48">
        <Image
          alt={title}
          src={imageUrl}
          className="rounded-lg border-2 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/default-image.jpg'; // Set default image path
            e.currentTarget.onerror = null; // Prevents infinite loop in case the fallback image also fails
          }}
          fill
        />

        <div className="absolute left-[50%] top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 transform items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-white">
          <ImageIcon size={16} />
          <span>{images_count}</span>
          <span>hình</span>
        </div>
      </div>
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

const TitleTriggerOpenProductDetail = ({
  title,
  visible,
  product,
}: {
  title: string;
  visible: boolean;
  product: Product;
}) => {
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_postId, setSelectedPostId] = useAtom(selectedPostId);
  const isMobile = useIsMobile();
  const { openModal } = useModals();

  const openModalPostDetail = async () => {
    console.log('fffffff', product.uid);
    if (isMobile) {
      openModal({
        name: title,
        title: <ProductDetailTitleBts product={product} />,
        content: <PostDetailMobile productUid={product.uid} />,
        maxHeightPercent: 0.95,
        footer: <AuthorInfo />,
        headerHeight: 74.59,
        footerHeight: 74.59,
        // pushToPath: product.detail_path,
      });
    } else {
      setSelectedPostId(product.uid);
      await queryClient.prefetchQuery({
        queryKey: ['get-detail-post', product.uid],
        queryFn: () => services.posts.getDetailPost(product.uid),
      });
    }
  };

  return (
    <span
      className="mb-3 cursor-pointer text-16 font-semibold hover:text-primary_color"
      onClick={openModalPostDetail}
    >
      {title}
      <span className={`text-sm font-semibold text-[#dc3545] ${visible ? 'hidden' : ''}`}>
        <span className="mx-2"> · </span>
        <span className="space-x-1">
          <TriangleAlert className="inline-block" color="#dc3545" size={16} />
          <span> Tin đang bị ẩn! </span>
          <TriangleAlert className="inline-block" color="#dc3545" size={16} />
        </span>
      </span>
    </span>
  );
};
