import React from 'react';
import { IProduct } from './type';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import useResizeImage from '@hooks/useResizeImage';
import {
  Page,
  Navbar,
  NavbarBackLink,
  BlockTitle,
  BlockHeader,
  Block,
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
  BreadcrumbsCollapsed,
  Popover,
  List,
  ListItem,
  Link,
} from 'konsta/react';
import { useGetDetailProduct } from '@api/get-detail-product';
export default function DetailProductCard({ product }: { product: IProduct }) {
  const { data } = useGetDetailProduct(product.uid);
  console.log('detail_product', data?.data.data);

  const { buildThumbnailUrl } = useResizeImage();
  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs>
        <BreadcrumbsItem>
          <Link>Home</Link>
        </BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem active>{product.slug}</BreadcrumbsItem>
      </Breadcrumbs>
      <AspectRatio.Root ratio={16 / 9}>
        <img
          className="Image rounded-md"
          src={buildThumbnailUrl({
            imageUrl: product?.featured_image_url,
          })}
          alt={product?.name}
        />
      </AspectRatio.Root>
    </div>
  );
}
