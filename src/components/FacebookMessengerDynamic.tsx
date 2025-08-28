'use client';

import dynamic from 'next/dynamic';

// ✅ Dynamic Facebook Messenger for better PageSpeed
const FacebookMessenger = dynamic(
  () => import('@/components/facebook-messenger').then(mod => ({ default: mod.FacebookMessenger })),
  {
    ssr: false, // Don't load on server (client component can use this)
    loading: () => null // No loading component needed
  }
);

interface FacebookMessengerDynamicProps {
  pageId: string;
}

export default function FacebookMessengerDynamic({ pageId }: FacebookMessengerDynamicProps) {
  return <FacebookMessenger pageId={pageId} />;
}
