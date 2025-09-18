import { getUserAgentInfo } from '@common/getUserAgentInfo';
import NewPost from '@dashboard/PostManagement/manage-posts/NewPost';
import React from 'react';

const NewPostPage: React.FC = async () => {
  const { isMobile } = await getUserAgentInfo();
  return <NewPost isMobile={isMobile} />
};

export default NewPostPage;
