import { getUserAgentInfo } from '@common/getUserAgentInfo';
import type { Params } from '@common/models';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import ManageProductApis from '@dashboard/PostManagement/manage-post/apis/product-api';
import EditPost from '@dashboard/PostManagement/manage-post/EditPost';

export default async function PostDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  const productUid = slug[0];

  const queryClient = new QueryClient();
  // Prefetch api in server
  await queryClient.prefetchQuery({
    queryKey: ['get-detail-manage-post', productUid],
    queryFn: () => ManageProductApis.getDetail(productUid),
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isMobile } = await getUserAgentInfo();
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <EditPost productUid={productUid} isMobile={isMobile} />
    </HydrationBoundary>
  );
}
