import PostManagement from '@dashboard/PostManagement';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Danh sách tin',
  description: 'Quản lý danh sách tin tức',
};

const NewPostPage: React.FC = async () => {
  return <PostManagement />;
};

export default NewPostPage;
