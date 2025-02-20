import React from 'react';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import { Metadata } from 'next';
import TaskDataTable from '@views/dashboard/main-manage-post/collection-post';

export const metadata: Metadata = {
  title: 'Danh sách tin',
  description: 'Quản lý danh sách tin tức',
};

const NewPostPage: React.FC = () => {
  const { isMobile } = useGetUserAgentInfo();
  if (isMobile) {
    return (
      <div className="">
        <TaskDataTable />
      </div>
    );
  } else {
    return <TaskDataTable />;
  }
};

export default NewPostPage;
