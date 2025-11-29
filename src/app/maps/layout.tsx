import ProviderWrapper from '@app/provider-wrapper';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import GoogleAnalytics from '@frontend/analytics/GoogleAnalytics';

export default async function MapsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile } = await getUserAgentInfo();

  return (
    <ProviderWrapper isMobile={isMobile}>
      {/* Full-screen maps layout without header/footer */}
      <main className="h-screen w-screen overflow-hidden">{children}</main>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </ProviderWrapper>
  );
}
