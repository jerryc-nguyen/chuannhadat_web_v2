import { getUserAgentInfo } from '@common/getUserAgentInfo';
import TaskDataTable from '@views/dashboard/main-manage-post/collection-post';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Danh sách tin',
  description: 'Quản lý danh sách tin tức',
};

const NewPostPage: React.FC = async () => {
  const { isMobile } = await getUserAgentInfo();
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
