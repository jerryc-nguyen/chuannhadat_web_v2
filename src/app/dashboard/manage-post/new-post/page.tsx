import React from 'react';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import NewPost from '@desktop/dashboard/main-manage-post/manage-post/new_post';

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
