import { getUserAgentInfo } from '@common/getUserAgentInfo';
import NewPost from '@dashboard/PostManagement/manage-post/NewPost';
import React from 'react';

const NewPostPage: React.FC = async () => {
  const { isMobile } = await getUserAgentInfo();
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
