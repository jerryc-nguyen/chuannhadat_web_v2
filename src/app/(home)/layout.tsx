import 'react-toastify/dist/ReactToastify.css';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import HeaderMobile from '@mobile/header/HeaderMobile';
import HeaderDesktop from '@views/components/HeaderDeskop';
import Footer from '@views/components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile } = useGetUserAgentInfo();
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
