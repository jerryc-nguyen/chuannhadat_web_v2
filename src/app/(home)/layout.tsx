import 'react-toastify/dist/ReactToastify.css';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import HeaderMobile from '@mobile/header/HeaderMobile';
import HeaderDesktop from '@desktop/components/HeaderDeskop';

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
    </>
  );
}
