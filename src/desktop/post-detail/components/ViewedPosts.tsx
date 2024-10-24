import { services } from '@api/services';
import ProductCard from '@desktop/home/components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { v4 as uuid } from 'uuid';

type ViewedPostsProps = {
  productUid: string;
  isInsideModal?: boolean;
};

const ViewedPosts: React.FC<ViewedPostsProps> = ({ productUid, isInsideModal = false }) => {
  const { data: viewedPosts } = useQuery({
    queryKey: ['get-viewed-post', productUid],
    queryFn: () => services.posts.getDetailPost(productUid),
    select: (data) => data.data,
  });

  return (
    <section className="description flex flex-col gap-1 rounded-xl border bg-white p-6">
      <h3 className="pb-5 text-xl font-semibold">Tin vừa xem</h3>
      <section className="flex w-full gap-x-3">
        {new Array(isInsideModal ? 2 : 3).fill(0).map(() => (
          <ProductCard key={uuid()} isShowAuthor={false} product={viewedPosts} />
        ))}
      </section>
    </section>
  );
};

export default ViewedPosts;
