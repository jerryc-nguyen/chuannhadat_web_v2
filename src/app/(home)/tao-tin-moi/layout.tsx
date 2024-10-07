import PageContainer from '@components/page-container/page-container';
import Breadcrumb from './components/breadcrumb';
import { Metadata } from 'next';
import { IBreadcrumbItem } from '@desktop/dashboard/states/breadcrumbAtom';

type NewPostPageLayoutProps = {
  children: React.ReactNode;
};

const currentBreadcrumb: IBreadcrumbItem[] = [
  {
    link: '/',
    title: 'Trang chủ',
    isActive: false,
  },
  {
    link: '/',
    title: 'Quản lý tin đăng',
    isActive: true,
  },
  {
    link: '/',
    title: 'Đăng tin bán & cho thuê',
    isActive: true,
  },
];

export const metadata: Metadata = {
  title: 'Create new post',
  description: 'Create new post',
};

const NewPostPageLayout: React.FC<NewPostPageLayoutProps> = ({ children }) => {
  return (
    <PageContainer>
      <div className="flex-1 space-y-4">
        <div className="flex items-center">
          <Breadcrumb breadcrumbs={currentBreadcrumb} />
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </PageContainer>
  );
};

export default NewPostPageLayout;
