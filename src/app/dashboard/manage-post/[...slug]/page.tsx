import { getUserAgentInfo } from '@common/getUserAgentInfo';
import type { Params } from '@models';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import ManageProductApis from '@views/dashboard/main-manage-post/manage-post/apis/product-api';
import EditPost from '@views/dashboard/main-manage-post/manage-post/edit_post';

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
      {isMobile ? (
        <div className="c-mobileApp">
          <EditPost productUid={productUid} />
        </div>
      ) : (
        <EditPost productUid={productUid} />
      )}
    </HydrationBoundary>
  );
}
