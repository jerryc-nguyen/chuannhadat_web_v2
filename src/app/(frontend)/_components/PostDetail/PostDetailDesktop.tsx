'use client';
import React, { useMemo } from 'react';

import { IProductDetail } from '@common/types';
import Breadcrumb, { ConvertFromBreadcrumbListJSONLd } from '@components/desktop/components/breadcrumb';
import { useSetAtom } from 'jotai';
import AuthorPost from './components/author-post';
import DescriptionPost from './components/description-post';
import FeaturesPost from './components/features-post';
import NotePost from './components/note-post';
import OverviewPost from './components/overview-post';
import { postDetailAtom } from './states/postDetailAtoms';

type PostDetailDesktopProps = { product: IProductDetail };

const PostDetailDesktop: React.FC<PostDetailDesktopProps> = ({ product }) => {
  const setPostDetailData = useSetAtom(postDetailAtom);

  React.useEffect(() => {
    setPostDetailData(product);
  }, [product, setPostDetailData]);

  const breadcrumbsData = useMemo(() => {
    return ConvertFromBreadcrumbListJSONLd(product?.breadcrumb);
  }, [product]);

  return (
    <>
      <div className="mx-auto mt-5 flex justify-between gap-x-4">
        <Breadcrumb breadcrumbs={breadcrumbsData} isLastLink={true} />
      </div>

      {product?.breadcrumb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(product?.breadcrumb) }}
        />
      )}
      <div className="mx-auto flex justify-between gap-x-4 py-5">
        <div className="content-post flex flex-[3] flex-col gap-y-4">
          <OverviewPost isLoading={false} data={product as IProductDetail} />
          <FeaturesPost isLoading={false} data={product as IProductDetail} />
          <DescriptionPost isLoading={false} data={product as IProductDetail} />
          <NotePost />
        </div>
        <AuthorPost className="!top-16" data={product as IProductDetail} />
      </div>
    </>
  );
};

export default PostDetailDesktop;
