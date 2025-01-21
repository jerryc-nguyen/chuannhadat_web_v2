import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import EditPost from '@desktop/dashboard/main-manage-post/manage-post/edit_post';
import ManageProductApis from '@desktop/dashboard/main-manage-post/manage-post/apis/product-api';

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const productUid = params.slug

  const queryClient = new QueryClient();
  // Prefetch api in server
  await queryClient.prefetchQuery({
    queryKey: ['get-detail-manage-post', productUid],
    queryFn: () => ManageProductApis.getDetail(productUid),
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isMobile } = useGetUserAgentInfo();
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {isMobile ? (
        <div className="c-mobileApp">
          <EditPost params={params} />
        </div>
      ) : (
        <EditPost params={params} />
      )}
    </HydrationBoundary>
  );
}
