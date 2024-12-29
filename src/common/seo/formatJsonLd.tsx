import { getServerSideURL } from '@common/getURL';
import Script from 'next/script';
import { Organization, Thing, WithContext } from 'schema-dts';

export const defaultJsonLd: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ChuanNhaDat',
  url: `${getServerSideURL()}`,
  logo: `${getServerSideURL()}/images/logo_v2_3@2x.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '0966662192',
    contactType: 'customer service',
    areaServed: 'VN',
    availableLanguage: 'Vietnamese',
  },
};

type PropsJsonLdScript<T extends Thing> = {
  jsonLd: WithContext<T>;
};

export function generateJsonld<T extends Thing>({
  jsonLd,
}: PropsJsonLdScript<T>): JSX.Element {
  return {
    '@context': 'https://schema.org',
    ...jsonLd,
  }
}
