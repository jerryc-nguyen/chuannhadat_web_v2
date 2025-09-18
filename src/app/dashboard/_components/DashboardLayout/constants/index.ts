import { BadgeDollarSign, FileText, Home, UserCircle } from 'lucide-react';
import { INavLinkGroup } from '../types';
import { DASHBOARD_ROUTES } from '@common/router';

export const listNavDashboard: INavLinkGroup[] = [
  {
    name: 'Dashboard',
    url: DASHBOARD_ROUTES.index,
    icon: Home,
  },
  {
    name: 'Thông tin cá nhân',
    url: '',
    icon: UserCircle,
    links: [
      {
        name: 'Cài đặt tài khoản',
        url: DASHBOARD_ROUTES.profile.accountSettings,
      },
      {
        name: 'Thông báo',
        url: DASHBOARD_ROUTES.profile.notifications,
      },
    ],
  },
  {
    name: 'Quản lý tin đăng',
    url: '',
    icon: FileText,
    links: [
      {
        name: 'Đăng tin',
        url: DASHBOARD_ROUTES.posts.new,
      },
      {
        name: 'Danh sách tin',
        url: DASHBOARD_ROUTES.posts.index,
      },
      {
        name: 'Thời gian tự động làm mới',
        url: DASHBOARD_ROUTES.posts.autoRefresh,
      },
    ],
  },
  {
    name: 'Quản lý tài chính',
    icon: BadgeDollarSign,
    url: '',
    links: [
      {
        name: 'Thông tin số dư',
        url: DASHBOARD_ROUTES.balance.summary,
      },
      {
        name: 'Nạp tiền vào tài khoản',
        url: DASHBOARD_ROUTES.balance.topup,
      },
      {
        name: 'Lịch sử nạp tiền',
        url: DASHBOARD_ROUTES.balance.topUpHistory,
      },
      {
        name: 'Mua gói dịch vụ',
        url: DASHBOARD_ROUTES.balance.pricingPlans,
      }
    ],
  }
];
