'use client';

import React, { useEffect } from 'react';
import { authorAtom, postDetailAtom } from '@mobile/post-detail/states';
import { useAtom, useSetAtom } from 'jotai';
import { useQuery, isServer } from '@tanstack/react-query';
import { services } from '@api/services';
import Spinner from '@components/ui/spinner';
import PhotosCarousel from '@mobile/post-detail/components/PhotosCarousel';
import ProductDescription from './components/ProductDescription';
import Section from '@mobile/ui/Section';
import { FeaturesList } from '@desktop/post-detail/components/features-post';

export default function PostDetailMobile({ productUid }: { productUid: string }) {
  const [postDetail, setPostDetail] = useAtom(postDetailAtom);
  const setAuthor = useSetAtom(authorAtom);

  const { data: product, isLoading } = useQuery({
    queryKey: ['get-detail-post', productUid],
    queryFn: () => services.posts.getDetailPost(productUid),
    enabled: !!productUid && productUid !== '/', // Ensure query is enabled only if productUid is valid
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
    select: (data) => data.data
  });

  useEffect(() => {
    if (product) {
      setAuthor(product?.author);
      setPostDetail(product);
    }
  }, [product, setPostDetail]);

  if (!isServer && isLoading)
    return (
      <div className="m-auto flex h-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-0">
      <PhotosCarousel product={product} />

      <Section title={product?.title}>
        <FeaturesList data={product} />
      </Section>

      <ProductDescription product={product} />
    </div>
  );
}
