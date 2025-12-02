'use client';

import NotFound from '@app/not-found';
import Spinner from '@components/ui/spinner';
import { usePostDetail } from '@common/hooks/usePostDetail';
import AuthorInfo from './components/AuthorInfo';
import PhotosCarousel from './components/PhotosCarousel';
import { authorAtom, postDetailAtom } from './states';
import type { IProductDetail } from '@common/types';
import Section from '@components/mobile-ui/Section';
import { isServer } from '@tanstack/react-query';
import { FeaturesList } from '../components/features-post';
import { useSetAtom } from 'jotai';
import usePostDetailTracking from '../hooks/usePostDetailTracking';
import React, { useEffect } from 'react';
import ProductDescription from '../components/ProductDescription';
import './PostDetailMobile.scss';

export default function PostDetailMobile({ productUid, isModal = true }: { productUid: string, isModal?: boolean }) {
  const setPostDetail = useSetAtom(postDetailAtom);
  const setAuthor = useSetAtom(authorAtom);

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

  useEffect(() => {
    if (product) {
      setAuthor(product.author);
    }
  }, [product, setAuthor]);

  // Track view when component mounts (for mobile direct access)
  React.useEffect(() => {
    if (productUid && productUid !== '/') {
      trackPostView(productUid);
    }
  }, [productUid, trackPostView]);

  useEffect(() => {
    if (product) {
      setPostDetail(product);
    }
  }, [product, setPostDetail]);

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
      {!isModal && (
        <div className="c-mblAuthorInfo">
          <div className="p-4">
            <AuthorInfo />
          </div>
        </div>
      )}
    </div>
  );
}
