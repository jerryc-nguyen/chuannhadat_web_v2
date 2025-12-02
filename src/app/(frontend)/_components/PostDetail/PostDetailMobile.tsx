'use client';
import PhotosCarousel from './mobile/components/PhotosCarousel';
import { authorAtom, postDetailAtom } from './mobile/states';
import type { IProductDetail } from '@common/types';
import Section from '@components/mobile-ui/Section';
// Removed client fetching; this component now relies on server-provided product
import { FeaturesList } from './components/features-post';
import { useSetAtom } from 'jotai';
import usePostDetailTracking from './hooks/usePostDetailTracking';
import React, { useEffect } from 'react';
import ProductDescription from './components/ProductDescription';
import './mobile/PostDetailMobile.scss';
import AuthorInfo from '@app/(frontend)/_components/PostDetail/mobile/components/AuthorInfo';

export default function PostDetailMobile({ productUid, product }: { productUid?: string; product?: IProductDetail; isModal?: boolean }) {
  const setPostDetail = useSetAtom(postDetailAtom);
  const setAuthor = useSetAtom(authorAtom);

  // Use the centralized tracking hook
  const { trackPostView } = usePostDetailTracking();

  // No client-side fetching; rely on `product` passed from server/page

  useEffect(() => {
    if (product) {
      setAuthor(product.author);
    }
  }, [product, setAuthor]);

  // Track view when component mounts (for mobile direct access)
  useEffect(() => {
    const uid = product?.uid ?? productUid;
    if (uid && uid !== '/') {
      trackPostView(uid);
    }
  }, [product, productUid, trackPostView]);

  useEffect(() => {
    if (product) {
      setPostDetail(product);
    }
  }, [product, setPostDetail]);

  // If no product provided, render nothing (modal contexts should pass product)
  if (!product) return null;
  return (
    <div className="flex flex-col gap-4 p-0">
      <PhotosCarousel product={product as IProductDetail} />
      <Section title={product?.title}>
        <FeaturesList data={product} />
      </Section>
      <ProductDescription product={product as IProductDetail} />

      <div className="c-mblAuthorInfo">
        <div className="p-4">
          <AuthorInfo />
        </div>
      </div>
    </div>
  );
}
