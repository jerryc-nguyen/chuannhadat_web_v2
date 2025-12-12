import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import type { Params, IProductDetail, IResponseData } from '@common/types';
import { Metadata } from 'next';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { postsApi } from '@frontend/PostDetail/api/posts';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import { QueryKeys } from '@common/QueryKeys';
import { notFound } from 'next/navigation';
import PostDetailDesktop from '@app/(frontend)/_components/PostDetail/PostDetailDesktop';
import PostDetailMobile from '@app/(frontend)/_components/PostDetail/PostDetailMobile';

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = `/post/${slug}`;

  // Get search params to check for query strings
  const searchParamsObj = await searchParams;
  const hasQueryString = Object.keys(searchParamsObj).length > 0;

  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS.METADATA, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata, hasQueryString);
}

export default async function PostDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const rawSlug = Array.isArray(slug) ? slug[0] : slug;
  const productUid = typeof rawSlug === 'string' ? rawSlug.split('-').slice(-1)[0] : '';
  const { isMobile } = await getUserAgentInfo();

  const queryClient = new QueryClient();
  let product: IProductDetail | undefined;

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
    product = detailEnvelope?.data;

    if (isErrorEnvelope || !product || product.visibility !== 'visible' || product.hide_on_frontend_reason) {
      notFound();
    }

    await queryClient.prefetchQuery({
      queryKey: QueryKeys.postsSameAuthor(productUid),
      queryFn: () => postsApi.getPostsSameAuthor(productUid),
    });
  } else {
    notFound();
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {product?.json_lds && Array.isArray(product.json_lds) && product.json_lds.map((json_ld) => (
        <script
          key={json_ld['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(json_ld) }}
        />
      ))}

      {isMobile ? (
        <div className="c-mobileApp">
          <PostDetailMobile productUid={productUid} product={product} />
        </div>
      ) : (
        <PostDetailDesktop product={product as IProductDetail} />
      )}
    </HydrationBoundary>
  );
}
