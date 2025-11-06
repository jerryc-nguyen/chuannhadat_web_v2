import ListPostsV2 from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Danh sách tin',
  description: 'Quản lý danh sách tin tức',
};

const NewPostPage: React.FC = async () => {

  const { isMobile } = await getUserAgentInfo();

  return (
    <ListPostsV2 isMobile={isMobile} />
  );

};

export default NewPostPage;
