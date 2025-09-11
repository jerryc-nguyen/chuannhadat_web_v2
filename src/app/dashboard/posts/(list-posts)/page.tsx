import { getUserAgentInfo } from '@common/getUserAgentInfo';
import PostManagement from '@dashboard/PostManagement/manage-post/ListPosts';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Danh sách tin',
  description: 'Quản lý danh sách tin tức',
};

const NewPostPage: React.FC = async () => {

  const { isMobile } = await getUserAgentInfo();

  return (
    <PostManagement isMobile={isMobile} />
  );

};

export default NewPostPage;
