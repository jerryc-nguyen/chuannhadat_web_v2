import FinancialManagement from '@dashboard/FinancialManagement';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông tin số dư',
  description: 'Chuẩn Nhà Đất',
};

const Page = async () => {
  return <FinancialManagement />;
};

export default Page;
