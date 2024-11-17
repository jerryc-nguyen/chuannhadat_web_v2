import axiosInstance from '@api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/utils';
import NewsDesktop from '@desktop/news/NewsDesktop';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import NewsMobile from '@mobile/news/NewsMobile';
import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const path = 'tin-tuc';
  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata);
}

function NewsPage() {
  const { isMobile } = useGetUserAgentInfo();
  return isMobile ? <NewsMobile /> : <NewsDesktop />;
}

export default NewsPage;
