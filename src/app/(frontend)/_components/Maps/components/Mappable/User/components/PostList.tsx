'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@frontend/features/search/api/searchApi';
import { IUser } from '@common/types';
import Image from 'next/image';
import empty_city from '@assets/images/empty-city.png';
import PostItem from './PostItem';

interface PostListProps {
  profileData: IUser;
  wardId?: number;
}

interface Post {
  id: number;
  title: string;
  price: string;
  price_per_m2?: string;
  area?: string;
  address: string;
  created_at: string;
  slug: string;
  thumbnail_url?: string;
  photo_count?: number;
  is_priority?: boolean;
  property_type?: string;
  bedroom_count?: string;
  author?: {
    name: string;
    avatar_url?: string;
    posts_count?: number;
  };
  is_partner?: boolean;
}

const PostList: React.FC<PostListProps> = ({ profileData, wardId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-posts-maps', profileData.slug, wardId],
    queryFn: () =>
      searchApi({
        author_slug: profileData.slug,
        ward_id: wardId,
        page: 1,
        per_page: 5, // Show only 5 posts in the info panel
        aggs_for: 'profile',
      }),
    enabled: !!profileData.slug,
  });

  const posts = data?.data || [];
  const pagination = data?.pagination;

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

  const handlePostClick = (post: Post) => {
    // Handle post click - could navigate to post detail page
    console.log('Post clicked:', post);
  };

  return (
    <div>
      <div className="space-y-3">
        {posts.map((post: Post) => (
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
