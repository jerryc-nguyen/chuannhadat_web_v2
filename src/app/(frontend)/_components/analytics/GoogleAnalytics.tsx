'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId?: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId) return null;

  return (
    <>
      {/* Google Analytics - deferred for PageSpeed */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
