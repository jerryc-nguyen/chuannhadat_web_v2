import { Sidebar, Header } from '@features/management/layout';
import { PropsWithChildren } from 'react';

type ManagementLayoutProps = PropsWithChildren;

const ManagementLayout = ({ children }: ManagementLayoutProps) => {
  return (
    <div className="relative flex min-h-screen">
      <Sidebar className="sticky left-0 top-0 z-10 h-screen" />
      <div className="flex-1">
        <Header className="sticky left-0 top-0 z-10" />
        <div className="h-[1500px] p-6">{children}</div>
      </div>
    </div>
  );
};

export default ManagementLayout;
