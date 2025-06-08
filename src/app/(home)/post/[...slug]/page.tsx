import axiosInstance from '@api/axiosInstance';
import { services } from '@api/services';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import PostDetailMobile from '@mobile/post-detail/PostDetailMobile';
import type { Params } from '@models';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import PostDetailDesktop from '@views/post-detail';
import { Metadata } from 'next';

export async function generateMetadata ( { params }: { params: Params } ): Promise<Metadata> {
  const { slug } = await params;
  const path = `/post/${slug}`;
  const rawMetadata = ( await axiosInstance.get( API_ROUTES.SEOS, { params: { path } } ) )
    .data as Metadata;
  return createMetadata( rawMetadata );
}
export default async function PostDetailPage ( { params }: { params: Params } ) {
  const { slug } = await params;
  const productUid = slug[0].split( '-' ).slice( -1 )[0];
  const queryClient = new QueryClient();
  // Prefetch api in server
  await queryClient.prefetchQuery( {
    queryKey: ['get-detail-post', productUid],
    queryFn: () => services.posts.getDetailPost( productUid ),
  } );
  await queryClient.prefetchQuery( {
    queryKey: ['get-posts-same-author', productUid],
    queryFn: () => services.posts.getPostsSameAuthor( productUid ),
  } );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isMobile } = await getUserAgentInfo();
  const dehydratedState = dehydrate( queryClient );
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
