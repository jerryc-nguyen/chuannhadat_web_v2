'use client';
import { services } from '@api/services';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React from 'react';

import AuthorPost from './components/author-post';
import OverviewPost from './components/overview-post';
import FeaturesPost from './components/features-post';
import DescriptionPost from './components/description-post';
import { IProductDetail } from '@mobile/searchs/type';
import NotePost from './components/note-post';
import MainNav from '@desktop/components/MainNav';
import { useSetAtom } from 'jotai';
import { postDetailAtom } from './states/postDetailAtoms';

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
  return (
    <section className="bg-[#f0f2f5]">
      <header className="shadow-1 sticky top-0 z-50 bg-white px-[10vw]">
        <MainNav></MainNav>
      </header>
      <div className="mx-auto flex w-4/5 justify-between gap-x-4 py-5">
        <div className="content-post flex flex-[3] flex-col gap-y-4">
          <OverviewPost data={data as IProductDetail} />
          <FeaturesPost data={data as IProductDetail} />
          <DescriptionPost data={data as IProductDetail} />
          <NotePost />
        </div>
        <AuthorPost data={data as IProductDetail} />
      </div>
    </section>
  );
};

export default PostDetailDesktop;
