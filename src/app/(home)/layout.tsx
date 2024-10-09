import 'react-toastify/dist/ReactToastify.css';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import ModalsProvider from '@components/ModalsProvider';
import HeaderMobile from '@mobile/header/HeaderMobile';
import HeaderDesktop from '@desktop/components/HeaderDeskop';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile } = useGetUserAgentInfo();
  return (
    <>
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
      <main className="z-5 relative h-fit px-5 md:px-10">{children}</main>
      <ModalsProvider />
    </>
  );
}
