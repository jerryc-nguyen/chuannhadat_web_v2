'use client';
import React from 'react';
import { IUser, IProductList } from '@common/types';
import Image from 'next/image';
import empty_city from '@assets/images/empty-city.png';
import PostItem from './PostItem';
import { useUserPosts } from '../hooks/useUserPosts';
import { useAtomValue } from 'jotai';
import { businessTypeFilterAtom, categoryTypeFilterAtom } from '@maps/states/mapAtoms';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import useModalPostDetail from '@frontend/PostDetail/hooks/useModalPostDetail';
import { ProductDetailTitleBts } from '@frontend/CategoryPage/mobile/searchs/ProductCardV2';
import PostDetailMobile from '@frontend/PostDetail/PostDetailMobile';
import AuthorInfo from '@frontend/PostDetail/components/AuthorInfo';
import { useApp } from '@common/context/AppContext';

interface PostListProps {
  profileData: IUser;
  wardId?: number;
}

const PER_PAGE = 8;
const PostList: React.FC<PostListProps> = ({ profileData, wardId }) => {
  // Get current filter values from global state
  const businessType = useAtomValue(businessTypeFilterAtom);
  const categoryType = useAtomValue(categoryTypeFilterAtom);
  const { isMobile } = useApp();
  const { openModal } = useModals();
  const { handleOpenModal } = useModalPostDetail();

  const { posts, pagination, isLoading, error } = useUserPosts({
    authorSlug: profileData.slug,
    wardId,
    page: 1,
    perPage: PER_PAGE, // Show only 10 posts in the info panel
    businessType,
    categoryType,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-500">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error || !posts || posts.length === 0) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center py-8">
          <Image
            src={empty_city}
            alt="No posts"
            className="w-16 h-16 opacity-50 mb-2"
          />
          <p className="text-sm text-gray-500 text-center">
            {wardId ? 'Không có tin đăng nào trong khu vực này' : 'Chưa có tin đăng nào'}
          </p>
        </div>
      </div>
    );
  }

  const handlePostClick = (product: IProductList) => {
    // Handle post click - could navigate to post detail page
    console.log('Post clicked:', product);
    if (isMobile) {
      openModal({
        name: product.title,
        title: <ProductDetailTitleBts product={product} />,
        content: <PostDetailMobile productUid={product.uid} />,
        maxHeightPercent: 0.95,
        footer: <AuthorInfo />,
        headerHeight: 74.59,
        footerHeight: 74.59,
        supportPushState: false,
      });
    } else {
      handleOpenModal(product.uid);
    }
  };

  return (
    <div>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onClick={handlePostClick}
          />
        ))}
      </div>

      {/* Show more link if there are more posts than per_page */}
      {pagination && pagination.total_count > PER_PAGE && (
        <div className="mt-3">
          <a
            href={`/profile/${profileData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-2 text-sm text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Xem thêm {pagination.total_count - PER_PAGE} tin đăng
          </a>
        </div>
      )}
    </div>
  );
};

export default PostList;
