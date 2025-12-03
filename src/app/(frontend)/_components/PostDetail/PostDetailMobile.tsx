'use client';
import PhotosCarousel from './mobile/components/PhotosCarousel';
import type { IProductDetail } from '@common/types';
import Section from '@components/mobile-ui/Section';
// Removed client fetching; this component now relies on server-provided product
import { FeaturesList } from './components/features-post';
import usePostDetailTracking from './hooks/usePostDetailTracking';
import React, { useEffect, useMemo } from 'react';
import ProductDescription from './components/ProductDescription';
import './mobile/PostDetailMobile.scss';
import AuthorInfo from '@app/(frontend)/_components/PostDetail/mobile/components/AuthorInfo';
import Breadcrumb, { ConvertFromBreadcrumbListJSONLd } from '@components/desktop/components/breadcrumb';

export default function PostDetailMobile({ productUid, product }: { productUid?: string; product?: IProductDetail }) {
  const breadcrumbsData = useMemo(() => {
    return ConvertFromBreadcrumbListJSONLd(product?.breadcrumb);
  }, [product?.breadcrumb]);

  // Use the centralized tracking hook
  const { trackPostView } = usePostDetailTracking();

  // Track view when component mounts (for mobile direct access)
  useEffect(() => {
    const uid = product?.uid ?? productUid;
    if (uid && uid !== '/') {
      trackPostView(uid);
    }
  }, [product, productUid, trackPostView]);

  // If no product provided, render nothing (modal contexts should pass product)
  if (!product) return null;
  return (
    <div className="flex flex-col gap-4 p-0">
      <div className="mx-auto mt-5 flex justify-between gap-x-4 px-4">
        <Breadcrumb breadcrumbs={breadcrumbsData} isLastLink={true} />
      </div>
      <PhotosCarousel product={product as IProductDetail} />
      <Section title={product?.title}>
        <FeaturesList data={product} />
      </Section>
      <ProductDescription product={product as IProductDetail} />

      <div className="c-mblAuthorInfo">
        <div className="p-4">
          <AuthorInfo author={product?.author} />
        </div>
      </div>
    </div>
  );
}
