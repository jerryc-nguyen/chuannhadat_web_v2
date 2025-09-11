import { getUserAgentInfo } from '@common/getUserAgentInfo';
import HeaderMobile from '@components/features/layout/mobile-header/HeaderMobile';
import { GoogleAnalytics } from '@next/third-parties/google';
import Footer from '@components/desktop/components/Footer';
import HeaderDesktop from '@components/desktop/components/HeaderDeskop';
import FacebookMessengerDynamic from '@/components/FacebookMessengerDynamic';

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile } = await getUserAgentInfo();
  const mobileClass = isMobile ? '' : 'px-5 md:px-10';
  const facebookPageId = '669907066214107';
  return (
    <>
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
      <main className={`z-5 relative h-fit ${mobileClass}`}>{children}</main>
      <Footer />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      <FacebookMessengerDynamic pageId={facebookPageId} />
    </>
  );
}
