import Link from 'next/link';

import { BiUser } from 'react-icons/bi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { PiCurrencyDollar } from 'react-icons/pi';
import { LiaExchangeAltSolid } from 'react-icons/lia';
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from '@components/ui/accordion';

const MENU_GROUP = [
  {
    icon: <BiUser size={20} />,
    id: 'profile',
    label: 'Thông tin cá nhân',
    menus: [
      {
        path: '/management/account-setting',
        label: 'Cài đặt tài khoản',
      },
      {
        path: '/management/notification',
        label: 'Thông báo',
      },
    ],
  },
  {
    icon: <IoDocumentTextOutline size={20} />,
    label: 'Quản lý đăng tin',
    id: 'post',
    menus: [
      {
        path: '/management/post/create',
        label: 'Đăng tin',
      },
      {
        path: '/management/post/list',
        label: 'Danh sách tin',
      },
      {
        path: '/management/post/your-hashtag',
        label: 'Hash tag của bạn',
      },
      {
        path: '/management/post/seting-refresh',
        label: 'Cài đặt thời gian tự động làm mới tin đăng',
      },
    ],
  },
  {
    icon: <PiCurrencyDollar size={20} />,
    label: 'Quản lý tài chính',
    id: 'financial',
    menus: [
      {
        path: '/management/post/create',
        label: 'Thông tin số dư',
      },
      {
        path: '/management/post',
        label: 'Nạp tiền vào tài khoản',
      },
      {
        path: '/management/post/your-hashtag',
        label: 'Lịch sử nạp tiền',
      },
      {
        path: '/management/post/seting-refresh',
        label: 'Mua gói dịch vụ',
      },
      {
        path: '/management/post/seting-refresh',
        label: 'Dùng mã quà tặng/KM',
      },
    ],
  },
  {
    icon: <LiaExchangeAltSolid size={20} />,
    label: 'Quản lý yêu cầu',
    id: 'request',
    menus: [
      {
        path: '/management/post/create',
        label: 'Yêu cầu liên hệ lại',
      },
      {
        path: '/management/post',
        label: 'Yêu cầu tư vấn',
      },
    ],
  },
];

export const MenuGroup = () => {
  return (
    <Accordion
      className="bg-mauve6 w-full rounded-md shadow-black/5"
      type="single"
      collapsible
    >
      {MENU_GROUP.map((group) => (
        <AccordionItem key={group.id} value={group.id}>
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              {group.icon}
              {group.label}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3 pl-8 text-sm">
              {group.menus.map((menu) => (
                <div key={menu.path}>
                  <Link href={menu.path}>{menu.label}</Link>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
