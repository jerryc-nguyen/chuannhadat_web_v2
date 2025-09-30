'use client';
import React from 'react';
import FilterChips from '@frontend/features/search/filter-conditions/mobile/FilterChips';
import PostList from '@frontend/CategoryPage/mobile/searchs/PostList';

interface ProfileListPostProps {
  filteredChipOptions: any[];
}

const ProfileListPost: React.FC<ProfileListPostProps> = ({ filteredChipOptions }) => {
  return (
    <>
      <h2 className="mb-2 ml-4 mt-4 text-xl font-semibold text-primary_color">Tin đã đăng</h2>
      <div className="my-4">
        <FilterChips chipOptions={filteredChipOptions} />
      </div>
      <PostList />
    </>
  );
};

export default ProfileListPost;
