'use client';

import ManageProductApis from '@desktop/dashboard/main-manage-post/manage-post/apis/product-api';
import EditPost from '@desktop/dashboard/main-manage-post/manage-post/edit_post';
import { convertToProductFormData } from '@desktop/dashboard/main-manage-post/manage-post/helpers';
import { useQuery } from '@tanstack/react-query';
import { isMobile } from 'react-device-detect';

export default function PostDetailPage({ params }: { params: { slug: string } }) {
  const productUid = params.slug

  const { data: product, isLoading } = useQuery({
    queryKey: ['get-detail-manage-post', productUid],
    queryFn: () => ManageProductApis.getDetail(productUid),
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
    select: (data) => data.data,
  });

  const productFormData = convertToProductFormData(product || {});
  console.log('productFormData', productFormData);

  return (
    <>
      {isMobile ? (
        <div className="c-mobileApp">
          <EditPost product={productFormData} />
        </div>
      ) : (
        <EditPost product={productFormData} />
      )}
    </>
  );
}
