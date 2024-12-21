// Next Imports
import type { Metadata } from 'next';
import TopUpViewDesktop from '@desktop/dashboard/main-financial-management/top-up';

export const metadata: Metadata = {
  title: 'Nạp tiền vào tài khoản',
  description: 'Chuẩn Nhà Đất',
};

const Page = () => {
  return <TopUpViewDesktop />;
};

export default Page;
