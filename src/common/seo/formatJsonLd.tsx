import { getServerSideURL } from '@common/getURL';

export const defaultJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ChuanNhaDat',
  url: `${getServerSideURL()}`,
  logo: 'https://images.chuannhadat.com/images/logo_v2_3@2x.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '0966662192',
    contactType: 'customer service',
    areaServed: 'VN',
    availableLanguage: 'Vietnamese',
  },
};

export const generateBreadcrumbJsonLd = (breadcrumbs: { name: string; uri: string }[]) => {
  const itemListElement = breadcrumbs.map((item, index) => ({
    '@type': 'BreadcrumbList',
    position: index + 1,
    name: item.name,
    item: `${getServerSideURL()}${item.uri.startsWith('/') ? item.uri : `/${item.uri}`}`,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
};
