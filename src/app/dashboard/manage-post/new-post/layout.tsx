import PageContainer from '@components/page-container/page-container';
import { Metadata } from 'next';

type NewPostPageLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'Chuẩn nhà đất',
  description: 'Tạo mới bài đăng',
};

const NewPostPageLayout: React.FC<NewPostPageLayoutProps> = ({ children }) => {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">{children}</div>
    </PageContainer>
  );
};

export default NewPostPageLayout;
