import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import NewPost from '@desktop/dashboard/main-manage-post/new-post';

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const productUid = params.slug[0].split('-').slice(-1)[0];

  const queryClient = new QueryClient();
  // Prefetch api in server
  await queryClient.prefetchQuery({
    queryKey: ['get-detail-post', productUid],
    queryFn: () => services.posts.getDetailPost(productUid),
  });

  const { isMobile } = useGetUserAgentInfo();
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {isMobile ? (
        <div className="c-mobileApp">
          <NewPost />
        </div>
      ) : (
        <NewPost />
      )}
    </HydrationBoundary>
  );
}
