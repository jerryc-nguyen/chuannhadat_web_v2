import React from 'react';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import { Metadata } from 'next';
import NewPost from '@desktop/dashboard/main-manage-post/new-post';

export const metadata: Metadata = {
  title: 'Cập nhật tin tức',
  description: 'Quản lý cập nhật tin tức',
};

const NewPostPage: React.FC = () => {
  const { isMobile } = useGetUserAgentInfo();
  if (isMobile) {
    return (
      <div className="c-mobileApp">
        <NewPost />
      </div>
    );
  } else {
    return <NewPost />;
  }
};

export default NewPostPage;
