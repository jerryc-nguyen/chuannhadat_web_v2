import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import PostDetailDesktop from '@desktop/post-detail';
import { Metadata } from 'next';
import PostDetailMobile from '@mobile/post-detail/PostDetailMobile ';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/utils';
import axiosInstance from '@api/axiosInstance';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const path = `/post/${slug}`;
  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS, { params: { path } }))
  .data as Metadata;
  return createMetadata(rawMetadata);
}

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
          <PostDetailMobile productUid={productUid} />
        </div>
      ) : (
        <PostDetailDesktop />
      )}
    </HydrationBoundary>
  );
}
