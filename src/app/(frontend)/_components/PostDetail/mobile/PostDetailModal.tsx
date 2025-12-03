'use client';

import React from 'react';
import NotFound from '@app/not-found';
import Spinner from '@components/ui/spinner';
import { usePostDetail } from '@common/hooks/usePostDetail';
import AuthorInfo from './components/AuthorInfo';
import PhotosCarousel from './components/PhotosCarousel';
import type { IProductDetail } from '@common/types';
import Section from '@components/mobile-ui/Section';
import { isServer } from '@tanstack/react-query';
import { FeaturesList } from '../components/features-post';
import usePostDetailTracking from '../hooks/usePostDetailTracking';
import ProductDescription from '../components/ProductDescription';
import './PostDetailMobile.scss';

export default function PostDetailMobile({ productUid }: { productUid: string, isModal?: boolean }) {

  // Use the centralized tracking hook
  const { trackPostView } = usePostDetailTracking();

  const {
    data: product,
    isLoading,
    isSuccess,
    isError,
  } = usePostDetail({
    postId: productUid,
    enabled: !!productUid && productUid !== '/', // Ensure query is enabled only if productUid is valid
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
  });


  // Track view when component mounts (for mobile direct access)
  React.useEffect(() => {
    if (productUid && productUid !== '/') {
      trackPostView(productUid);
    }
  }, [productUid, trackPostView]);

  if (!isServer && isLoading)
    return (
      <div className="m-auto flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  if (isError || (isSuccess && !product))
    return <NotFound errorMessage="Bài viết không tồn tại hoặc đã bị xoá" isCritical={false} />;
  return (
    <div className="flex flex-col gap-4 p-0">
      <PhotosCarousel product={product as IProductDetail} />
      <Section title={product?.title}>
        <FeaturesList data={product} />
      </Section>
      <ProductDescription product={product} />

      <div className="c-mblAuthorInfo">
        <div className="p-4">
          <AuthorInfo author={product?.author} />
        </div>
      </div>

    </div>
  );
}
