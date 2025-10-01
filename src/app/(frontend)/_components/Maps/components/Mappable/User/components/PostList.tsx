'use client';
import React from 'react';
import { IUser, IProductList } from '@common/types';
import Image from 'next/image';
import empty_city from '@assets/images/empty-city.png';
import PostItem from './PostItem';
import { useUserPosts } from '../hooks/useUserPosts';
import { useAtomValue } from 'jotai';
import { businessTypeFilterAtom, categoryTypeFilterAtom } from '@maps/states/mapAtoms';

interface PostListProps {
  profileData: IUser;
  wardId?: number;
}

const PostList: React.FC<PostListProps> = ({ profileData, wardId }) => {
  // Get current filter values from global state
  const businessType = useAtomValue(businessTypeFilterAtom);
  const categoryType = useAtomValue(categoryTypeFilterAtom);

  const { posts, pagination, isLoading, error } = useUserPosts({
    authorSlug: profileData.slug,
    wardId,
    page: 1,
    perPage: 5, // Show only 5 posts in the info panel
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

  const handlePostClick = (post: IProductList) => {
    // Handle post click - could navigate to post detail page
    console.log('Post clicked:', post);
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

      {/* Show more indicator if there are more posts */}
      {pagination && pagination.total_count > posts.length && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">
            Hiển thị {posts.length} trong {pagination.total_count} tin đăng
          </span>
        </div>
      )}
    </div>
  );
};

export default PostList;
