'use client';

import DetailProductCard from '@mobile/searchs/DetailProductCard';
import { usePathname } from 'next/navigation';
import { useGetDetailProduct } from '@api/get-detail-product';
import { IProductDetail } from '@mobile/searchs/type';

export default function Page() {
  const currentPath = usePathname();
  const productUid = currentPath.split('-').slice(-1)[0];
  console.log('productUidproductUid', productUid);
  const {data} = useGetDetailProduct(productUid);
console.log(data && data.data)
  return !!data && <DetailProductCard product={data.data as IProductDetail} />;
}
