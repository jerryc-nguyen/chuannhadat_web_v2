import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { services } from '@api/services';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import type { Params } from '@models';
import PostDetailDesktop from './PostDetailDesktop';
import PostDetailMobile from './PostDetailMobile';

interface PostDetailProps {
  params: Params;
}

export default async function PostDetail({ params }: PostDetailProps) {
  const { slug } = await params;
  const productUid = slug[0].split('-').slice(-1)[0];
  const { isMobile } = await getUserAgentInfo();

  const queryClient = new QueryClient();

  // Prefetch api in server
  await queryClient.prefetchQuery({
    queryKey: ['get-detail-post', productUid],
    queryFn: () => services.posts.getDetailPost(productUid),
  });
  await queryClient.prefetchQuery({
    queryKey: ['get-posts-same-author', productUid],
    queryFn: () => services.posts.getPostsSameAuthor(productUid),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {isMobile ? (
        <div className="c-mobileApp">
          <PostDetailMobile productUid={productUid} />
        </div>
      ) : (
        <PostDetailDesktop />
      )}
    </HydrationBoundary>
  );
}
