import ListPostsV2 from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import { getInitialFilterStateFromUrl } from '@frontend/features/search/hooks/syncParamsToState.server';
import { buildQueryString } from '@common/urlHelper';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Danh sách tin',
  description: 'Quản lý danh sách tin tức',
};

type SearchParams = Record<string, string | string[] | undefined>;

const NewPostPage: React.FC<{ searchParams?: Promise<SearchParams> }> = async ({ searchParams }) => {
  const sp = (await searchParams) ?? {};
  const qs = buildQueryString(sp);
  const pathWithQuery = qs ? `/dashboard/posts?${qs}` : `/dashboard/posts`;

  const { isMobile } = await getUserAgentInfo();
  const { filterState } = await getInitialFilterStateFromUrl({ pathWithQuery, scope: 'manage_posts' });

  return (
    <ListPostsV2 isMobile={isMobile} initialFilterState={filterState} />
  );
};

export default NewPostPage;
