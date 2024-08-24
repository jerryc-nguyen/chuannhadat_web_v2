import Image from 'next/image';
import { UserBalanceInfo } from './UserBalanceInfo';
import { MenuGroup } from './MenuGroup';
import { twMerge } from 'tailwind-merge';

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div className={twMerge('flex w-72 flex-col border-r border-gray-200', className)}>
      <div className="flex justify-center py-4">
        <Image
          src={'https://chuannhadat.com/images/logo_v2_3@2x.png'}
          alt="ic_phone"
          width={180}
          height={36}
        />
      </div>
      <div>
        <UserBalanceInfo />
      </div>
      <div className="flex-1">
        <MenuGroup />
      </div>
      <div className="border-t py-4 text-center">v4.6_07.09.2023</div>
    </div>
  );
};
