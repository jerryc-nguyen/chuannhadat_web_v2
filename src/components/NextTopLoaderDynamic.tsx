'use client';

import dynamic from 'next/dynamic';

// ✅ Dynamic import NextTopLoader to reduce Total Blocking Time
const NextTopLoader = dynamic(() => import('nextjs-toploader'), {
  ssr: false,
  loading: () => null, // No loading indicator needed for progress bar
});

export default function NextTopLoaderDynamic() {
  return <NextTopLoader showSpinner={false} />;
}
