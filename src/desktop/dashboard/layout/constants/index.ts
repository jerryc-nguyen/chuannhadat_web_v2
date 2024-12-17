import { LuBadgeDollarSign, LuFileText, LuHome, LuRepeat, LuUserCircle } from 'react-icons/lu';
import { INavLinkGroup } from '../types';

export const listNavDashboard: INavLinkGroup[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: LuHome,
  },
  {
    name: 'Thông tin cá nhân',
    url: '',
    icon: LuUserCircle,
    links: [
      {
        name: 'Cài đặt tài khoản',
        url: '/account-settings',
      },
      {
        name: 'Thông báo',
        url: '/notifications',
      },
    ],
  },
  {
    name: 'Quản lý tin đăng',
    url: '',
    icon: LuFileText,
    links: [
      {
        name: 'Đăng tin',
        url: '/manage-post/new-post',
      },
      {
        name: 'Danh sách tin',
        url: '/manage-post/collection-post',
      },
      {
        name: 'Hashtag của bạn',
        url: '/manage-post/your-hashtag',
      },
      {
        name: 'Thời gian tự động làm mới',
        url: '/manage-post/auto-refresh',
      },
    ],
  },
  {
    name: 'Quản lý tài chính',
    icon: LuBadgeDollarSign,
    url: '',
    links: [
      {
        name: 'Thông tin số dư',
        url: '/balance-information',
      },
      {
        name: 'Nạp tiền vào tài khoản',
        url: '/top-up',
      },
      {
        name: 'Lịch sử nạp tiền',
        url: '/recharge-history',
      },
      {
        name: 'Mua gói dịch vụ',
        url: '/service-package',
      },
      {
        name: 'Dùng mã quà tặng / KM',
        url: '/code-promotion',
      },
    ],
  },
  {
    name: 'Quản lý yêu cầu',
    url: '',
    icon: LuRepeat,
    links: [
      {
        name: 'Yêu cầu liên hệ lại',
        url: '/request/call-back',
      },
      {
        name: 'Yêu cầu tư vấn',
        url: '/request/advise',
      },
    ],
  },
];
