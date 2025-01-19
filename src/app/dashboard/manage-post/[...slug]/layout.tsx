import PageContainer from "@components/page-container/page-container";
import { Metadata } from "next";
import { IBreadcrumbItem } from "@desktop/dashboard/states/breadcrumbAtom";
import Breadcrumb from "@desktop/components/breadcrumb";

type NewPostPageLayoutProps = {
  children: React.ReactNode;
};

const currentBreadcrumb: IBreadcrumbItem[] = [
  {
    link: "/",
    title: "Trang chủ",
    isActive: false,
  },
  {
    link: "/",
    title: "Quản lý tin đăng",
    isActive: true,
  },
  {
    link: "/",
    title: "Chỉnh sửa tin bán & cho thuê",
    isActive: true,
  },
];

export const metadata: Metadata = {
  title: 'Chuẩn nhà đất',
  description: 'Chỉnh sửa bài đăng',
};

const NewPostPageLayout: React.FC<NewPostPageLayoutProps> = ({ children }) => {

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <div className="flex items-center">
          <Breadcrumb breadcrumbs={currentBreadcrumb} />
        </div>

        <div className="space-y-4">
          {children}
        </div>
      </div>
    </PageContainer>
  );
};

export default NewPostPageLayout;
