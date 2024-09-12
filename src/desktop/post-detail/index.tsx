'use client';
import { services } from '@api/services';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React from 'react';

type PostDetailDesktopProps = object;

const PostDetailDesktop: React.FC<PostDetailDesktopProps> = () => {
  const currentPath = usePathname();
  const productUid = currentPath.split('-').slice(-1)[0];
  const {
    data: { data },
  } = useQuery({
    queryKey: ['get-detail-post', productUid],
    queryFn: () => services.posts.getDetailPost(productUid),
  });
  return <div>{JSON.stringify(data)}</div>;
};

export default PostDetailDesktop;
