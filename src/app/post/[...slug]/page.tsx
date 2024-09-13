import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import PostDetailDesktop from '@desktop/post-detail';
import { Metadata } from 'next';
import PostDetailMobile from '@mobile/searchs/PostDetailMobile ';

export const metadata: Metadata = {
  title: 'Chuẩn nhà đất',
  description: 'Chi tiết bài đăng',
};
export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const queryClient = new QueryClient();

  const { isMobile } = useGetUserAgentInfo();
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      {isMobile ? (
        <div className="c-mobileApp">
          <PostDetailMobile />
        </div>
      ) : (
        <PostDetailDesktop />
      )}
    </HydrationBoundary>
  );
}
