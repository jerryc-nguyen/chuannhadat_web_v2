'use client';
import React, { useEffect, useRef, useState } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import { MdOutlinePriceChange } from 'react-icons/md';
import { IoMdTime } from 'react-icons/io';
import { IoIosPricetags, IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { FaBed } from 'react-icons/fa';
import { LuWarehouse } from 'react-icons/lu';
import { FaBath } from 'react-icons/fa6';
import { FaHouseUser } from 'react-icons/fa';

import { authorAtom, postDetailAtom } from '@mobile/post-detail/states';
import { useAtom, useSetAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { services } from '@api/services';

import Spinner from '@components/ui/spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { Button } from '@components/ui/button';
import PhotosCarousel from '@mobile/post-detail/components/PhotosCarousel';
import ProductDescription from './components/ProductDescription';
import Section from '@mobile/ui/Section';
import { FeaturesList } from '@desktop/post-detail/components/features-post';


export default function PostDetailMobile({ productUid }: { productUid: string }) {
  const [postDetail, setPostDetail] = useAtom(postDetailAtom);
  const setAuthor = useSetAtom(authorAtom);

  const { data, isLoading } = useQuery({
    queryKey: ['get-detail-post', productUid],
    queryFn: () => (productUid ? services.posts.getDetailPost(productUid) : Promise.resolve(null)),
    enabled: !!productUid && productUid !== '/', // Ensure query is enabled only if productUid is valid
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
  });

  useEffect(() => {
    if (data) {
      setAuthor(data.data?.author);
      setPostDetail(data.data);
    }
  }, [data, setPostDetail]);

  useEffect(() => {
    const containers = document.querySelectorAll('.c-mobileApp');

    containers.forEach((container) => {
      if (isLoading) {
        (container as HTMLElement).style.height = '100vh';
      } else {
        (container as HTMLElement).style.height = 'auto';
      }
    });
  }, [isLoading]);

  if (isLoading)
    return (
      <div className="m-auto flex h-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-0">
      <PhotosCarousel product={postDetail} />

      <Section title={postDetail?.title}>
        <FeaturesList data={postDetail} />
      </Section>

      <ProductDescription product={postDetail} />
    </div>
  );
}
