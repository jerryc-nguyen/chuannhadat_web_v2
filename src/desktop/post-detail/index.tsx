'use client';
import { services } from '@api/services';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';

import AuthorPost from './components/author-post';
import OverviewPost from './components/overview-post';
import FeaturesPost from './components/features-post';
import DescriptionPost from './components/description-post';
import { IProductDetail } from '@mobile/searchs/type';
import NotePost from './components/note-post';
import { useSetAtom } from 'jotai';
import { postDetailAtom } from './states/postDetailAtoms';
import ViewedPosts from './components/ViewedPosts';
import Breadcrumb, { ConvertFromBreadcrumbListJSONLd } from '@desktop/components/breadcrumb';

type PostDetailDesktopProps = object;

const PostDetailDesktop: React.FC<PostDetailDesktopProps> = () => {
  const currentPath = usePathname();
  const setPostDetailData = useSetAtom(postDetailAtom);
  const productUid = currentPath.split('-').slice(-1)[0];
  const { data } = useQuery({
    queryKey: ['get-detail-post', productUid],
    queryFn: () => services.posts.getDetailPost(productUid),
    select: (data) => data.data,
  });

  React.useEffect(() => {
    if (data) {
      setPostDetailData(data);
    }
  }, [data, setPostDetailData]);

  const breadcrumbsData = useMemo(() => {
    return ConvertFromBreadcrumbListJSONLd(data?.breadcrumb);
  }, [data?.breadcrumb])


  return (
    <>
      <div className="mx-auto flex justify-between gap-x-4 mt-5">
        <Breadcrumb breadcrumbs={breadcrumbsData} />
      </div>

      <div className="mx-auto flex justify-between gap-x-4 py-5">
        <div className="content-post flex flex-[3] flex-col gap-y-4">
          <OverviewPost data={data as IProductDetail} />
          <FeaturesPost data={data as IProductDetail} />
          <DescriptionPost data={data as IProductDetail} />
          <ViewedPosts productUid={data?.uid as string} />
          <NotePost />
        </div>
        <AuthorPost data={data as IProductDetail} />
      </div>
    </>
  );
};

export default PostDetailDesktop;
