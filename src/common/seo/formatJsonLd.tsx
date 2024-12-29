import { getServerSideURL } from '@common/getURL';
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

export function JsonLdScript<T extends Thing>({ jsonLd }: PropsJsonLdScript<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    ></script>
  );
};