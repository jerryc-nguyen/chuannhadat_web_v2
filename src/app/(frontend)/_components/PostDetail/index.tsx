import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { postsApi } from './api/posts';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import type { Params, IProductDetail, IResponseData } from '@common/types';
import PostDetailDesktop from './PostDetailDesktop';
import PostDetailMobile from './PostDetailMobile';
import { QueryKeys } from '@common/QueryKeys';
import { notFound } from 'next/navigation';

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
    try {
      await queryClient.prefetchQuery({
        queryKey: QueryKeys.postDetail(productUid),
        queryFn: () => postsApi.getDetailPost(productUid),
      });
    } catch (e) {
      notFound();
    }

    const detailEnvelope = queryClient.getQueryData(QueryKeys.postDetail(productUid)) as
      | IResponseData<IProductDetail>
      | undefined;

    const isErrorEnvelope = !!detailEnvelope && (detailEnvelope.status === false || detailEnvelope.code === 404);
    const product = detailEnvelope?.data;

    if (isErrorEnvelope || !product || product.hide_on_frontend_reason) {
      notFound();
    }

    await queryClient.prefetchQuery({
      queryKey: QueryKeys.postsSameAuthor(productUid),
      queryFn: () => postsApi.getPostsSameAuthor(productUid),
    });
  }
  else {
    notFound();
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
