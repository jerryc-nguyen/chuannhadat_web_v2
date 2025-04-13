'use client';

import React, { useEffect } from 'react';
import { authorAtom, postDetailAtom } from '@mobile/post-detail/states';
import { useSetAtom } from 'jotai';
import { useQuery, isServer, useMutation } from '@tanstack/react-query';
import { services } from '@api/services';
import Spinner from '@components/ui/spinner';
import PhotosCarousel from '@mobile/post-detail/components/PhotosCarousel';
import ProductDescription from './components/ProductDescription';
import Section from '@mobile/ui/Section';
import { FeaturesList } from '@views/post-detail/components/features-post';
import AuthorInfo from '@mobile/post-detail/components/AuthorInfo';
import './PostDetailMobile.scss';
import NotFound from '@app/not-found';
import type { IProductDetail } from '@mobile/searchs/type';

export default function PostDetailMobile({ productUid }: { productUid: string }) {
  const setPostDetail = useSetAtom(postDetailAtom);
  const setAuthor = useSetAtom(authorAtom);

  const {
    data: product,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['get-detail-post', productUid],
    queryFn: () => services.posts.getDetailPost(productUid),
    enabled: !!productUid && productUid !== '/', // Ensure query is enabled only if productUid is valid
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
    select: (data) => data.data,
  });

  const { mutate: addViewPost } = useMutation({
    mutationFn: services.trackings.viewProduct,
  });

  if (product) {
    setAuthor(product.author);
  }

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
