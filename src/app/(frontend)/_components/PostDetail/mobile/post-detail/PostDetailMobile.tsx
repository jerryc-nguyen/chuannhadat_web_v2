'use client';

import { services } from '@api/services';
import NotFound from '@app/not-found';
import Spinner from '@components/ui/spinner';
import { usePostDetail } from '@hooks/usePostDetail';
import AuthorInfo from './components/AuthorInfo';
import PhotosCarousel from './components/PhotosCarousel';
import { authorAtom, postDetailAtom } from './states';
import type { IProductDetail } from '@frontend/CategoryPage/mobile/searchs/type';
import Section from '@mobile/ui/Section';
import { isServer, useMutation } from '@tanstack/react-query';
import { FeaturesList } from '@frontend/PostDetail/components/features-post';
import { useSetAtom } from 'jotai';
import React, { useEffect } from 'react';
import ProductDescription from './components/ProductDescription';
import './PostDetailMobile.scss';

export default function PostDetailMobile({ productUid }: { productUid: string }) {
  const setPostDetail = useSetAtom(postDetailAtom);
  const setAuthor = useSetAtom(authorAtom);

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

  const { mutate: addViewPost } = useMutation({
    mutationFn: services.trackings.viewProduct,
  });

  useEffect(() => {
    if (product) {
      setAuthor(product.author);
    }
  }, [product]);

  React.useEffect(() => {
    if (productUid) {
      addViewPost({
        product_uid: productUid,
      });
    }
  }, [productUid]);

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
      <div className="c-mblAuthorInfo p-4">
        <AuthorInfo />
      </div>
    </div>
  );
}
