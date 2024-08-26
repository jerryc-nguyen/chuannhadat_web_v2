'use client';

import DetailProductCard from '@mobile/searchs/DetailProductCard';
import { usePathname } from 'next/navigation';
import { useGetDetailProduct } from '@api/get-detail-product';

export default function Page() {
  const currentPath = usePathname();
  const productUid = currentPath.split('-').slice(-1)[0];
  console.log('productUidproductUid', productUid);
  const { data } = useGetDetailProduct(productUid);

  return !!data && <DetailProductCard product={data.data.data} />;
}
