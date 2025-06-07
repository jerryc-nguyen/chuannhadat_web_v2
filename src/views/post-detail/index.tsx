'use client';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';

import NotFound from '@app/not-found';
import { usePostDetail } from '@hooks/usePostDetail';
import { IProductDetail } from '@mobile/searchs/type';
import Breadcrumb, { ConvertFromBreadcrumbListJSONLd } from '@views/components/breadcrumb';
import { useSetAtom } from 'jotai';
import AuthorPost from './components/author-post';
import DescriptionPost from './components/description-post';
import FeaturesPost from './components/features-post';
import NotePost from './components/note-post';
import OverviewPost from './components/overview-post';
import ViewedPosts from './components/ViewedPosts';
import { postDetailAtom } from './states/postDetailAtoms';

type PostDetailDesktopProps = object;

const PostDetailDesktop: React.FC<PostDetailDesktopProps> = () => {
  const currentPath = usePathname() || '';
  const setPostDetailData = useSetAtom( postDetailAtom );
  const productUid = currentPath.split( '-' ).slice( -1 )[0];
  const { data, isLoading, isSuccess, isError } = usePostDetail( {
    postId: productUid,
    enabled: !!productUid,
  } );

  React.useEffect( () => {
    if ( data ) {
      setPostDetailData( data );
    }
  }, [data, setPostDetailData] );

  const breadcrumbsData = useMemo( () => {
    return ConvertFromBreadcrumbListJSONLd( data?.breadcrumb );
  }, [data?.breadcrumb] );

  if ( isError || ( isSuccess && !data ) )
    return <NotFound errorMessage="Bài viết không tồn tại hoặc đã bị xoá" isCritical={false} />;

  return (
    <>
      <div className="mx-auto mt-5 flex justify-between gap-x-4">
        <Breadcrumb breadcrumbs={breadcrumbsData} />
      </div>
      <div className="mx-auto flex justify-between gap-x-4 py-5">
        <div className="content-post flex flex-[3] flex-col gap-y-4">
          <OverviewPost isLoading={isLoading} data={data as IProductDetail} />
          <FeaturesPost isLoading={isLoading} data={data as IProductDetail} />
          <DescriptionPost isLoading={isLoading} data={data as IProductDetail} />
          <ViewedPosts productUid={data?.uid as string} />
          <NotePost />
        </div>
        <AuthorPost className="!top-16" data={data as IProductDetail} />
      </div>
    </>
  );
};

export default PostDetailDesktop;
