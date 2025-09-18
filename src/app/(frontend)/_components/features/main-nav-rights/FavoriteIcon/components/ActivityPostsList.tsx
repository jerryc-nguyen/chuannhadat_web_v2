import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { timeAgo } from '@common/utils';
import EmptyPost from '@assets/images/empty-state_wap_v1.svg';
import { LoadingThreeQuarters } from '@components/icons/CustomIcons';
import { IViewedProductDetail } from '../types';
import { ISavedProducts, IPagination } from '@common/types';

interface ActivityPostsListProps {
  data: ISavedProducts[] | IViewedProductDetail[];
  pagination?: IPagination;
  loadingRemovePostId: string;
  handleRemovePost: (uid: string) => Promise<void>;
}

const ActivityPostsList: React.FC<ActivityPostsListProps> = ({
  data,
  loadingRemovePostId,
  handleRemovePost,
  pagination,
}) => {
  if (pagination?.total_count === 0)
    return (
      <div className="mb-4 flex items-center justify-center pb-4 pt-2">
        <Image alt="empty-save-post" src={EmptyPost} />
      </div>
    );

  return data.map((post: ISavedProducts | IViewedProductDetail) => {
    const formatted_price = post?.product?.formatted_price;
    const formatted_area = post?.product?.formatted_area;
    const formatted_kt = post?.product?.formatted_kt;

    const isLoadingDelete = loadingRemovePostId === post?.product?.uid;

    return (
      <section
        key={post?.id}
        className="flex items-center gap-x-1 px-0 py-3 text-left hover:bg-slate-100 lg:px-5"
      >
        <Link href={post?.product?.detail_path} className="flex flex-1 cursor-pointer gap-x-2">
          <Image
            width={80}
            height={70}
            className="h-[70px] overflow-hidden rounded-sm border bg-slate-200 object-cover shadow-md"
            alt={post?.product?.title}
            src={post?.product?.images[0].url}
            unoptimized
          />

          <div className="flex flex-1 flex-col justify-between">
            <p className="line-clamp-2 text-xs font-semibold hover:text-primary_color">
              {post?.product?.title}
            </p>
            <div className="flex gap-2 text-xs font-light text-secondary">
              <span className="rounded-sm border px-1 font-medium">{formatted_price || '--'}</span>
              <span className="rounded-sm border px-1 font-medium">{formatted_area || '--'}</span>
              <span className="rounded-sm border px-1 font-medium">{formatted_kt || '--'}</span>
            </div>
            <span className="mt-1 text-xs font-light text-secondary">
              {timeAgo(post?.created_at)}
            </span>
          </div>
        </Link>
        {isLoadingDelete ? (
          <LoadingThreeQuarters className="animate-spin text-xl duration-500" />
        ) : (
          <X
            onClick={() => handleRemovePost(post?.product?.uid)}
            className="cursor-pointer text-xl hover:text-error_color"
          />
        )}
      </section>
    );
  });
};

export default ActivityPostsList;
