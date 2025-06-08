import { getUserAgentInfo } from '@common/getUserAgentInfo';
import HeaderMobile from '@mobile/header/HeaderMobile';
import { GoogleAnalytics } from '@next/third-parties/google';
import Footer from '@views/components/Footer';
import HeaderDesktop from '@views/components/HeaderDeskop';

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile } = await getUserAgentInfo();
  const mobileClass = isMobile ? '' : 'px-5 md:px-10';

  return (
    <>
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
      <main className={`z-5 relative h-fit ${mobileClass}`}>{children}</main>
      <Footer />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
    </>
  );
}
