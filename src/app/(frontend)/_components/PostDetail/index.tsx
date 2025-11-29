import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { postsApi } from './api/posts';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import type { Params } from '@common/types';
import PostDetailDesktop from './PostDetailDesktop';
import PostDetailMobile from './PostDetailMobile';

interface PostDetailProps {
  params: Params;
}

export default async function PostDetail({ params }: PostDetailProps) {
  const { slug } = await params;
  const rawSlug = Array.isArray(slug) ? slug[0] : slug;
  const productUid = typeof rawSlug === 'string' ? rawSlug.split('-').slice(-1)[0] : '';
  const { isMobile } = await getUserAgentInfo();

  const queryClient = new QueryClient();

  // Prefetch api in server
  if (productUid) {
    await queryClient.prefetchQuery({
      queryKey: ['get-detail-post', productUid],
      queryFn: () => postsApi.getDetailPost(productUid),
    });
    await queryClient.prefetchQuery({
      queryKey: ['get-posts-same-author', productUid],
      queryFn: () => postsApi.getPostsSameAuthor(productUid),
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {isMobile ? (
        <div className="c-mobileApp">
          <PostDetailMobile productUid={productUid} isModal={false} />
        </div>
      ) : (
        <PostDetailDesktop />
      )}
    </HydrationBoundary>
  );
}
