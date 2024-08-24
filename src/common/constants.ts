import { INavLinkGroup } from '@models/INavLinkGroups';
import { LuBadgeDollarSign, LuFileText, LuRepeat, LuUserCircle } from 'react-icons/lu';

export const CURRENT_USER_KEY = 'current_user';
export const ALL_VALUE = 'all';
export const ALL_TEXT = 'Tất cả';
export const ALL_OPTION = {
  value: ALL_VALUE,
  text: ALL_TEXT,
};
export const ALL_FILTER_OPTION = {
  id: ALL_VALUE,
  text: ALL_TEXT,
  params: {},
};
export const DEFAULT_BUSINESS_TYPE_OPTION = {
  value: 'sell',
  text: 'Bán',
};

export const SORT_OPTIONS = [
  {
    text: 'Tin mới nhất',
    value: 'published_at_desc',
  },
  {
    text: 'Giá theo m² thấp đến cao',
    value: 'price_per_m2_asc',
  },
  {
    text: 'Giá thấp đến cao',
    value: 'price_asc',
  },
  {
    text: 'Giá cao đến thấp',
    value: 'price_desc',
  },
  {
    text: 'Diện tích bé đến lớn',
    value: 'area_asc',
  },
  {
    text: 'Diện tích lớn đến bé',
    value: 'area_desc',
  },
];

export const TOKEN = 'token';
export const userLocalStorage = 'user';

export const QUERY_KEY = {
  LOGIN: ['login'],
  USER: ['user'],
};

export const listNavDashboard: INavLinkGroup[] = [
  {
    name: 'Thông tin cá nhân',
    url: '',
    icon: LuUserCircle,
    links: [
      {
        name: 'Cài đặt tài khoản',
        url: 'setup-account',
      },
      {
        name: 'Thông báo',
        url: 'notifications',
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
        url: 'manage/post/new-post',
      },
      {
        name: 'Danh sách tin',
        url: 'manage/post/sale-rent',
      },
      {
        name: 'Hashtag của bạn',
        url: 'manage/collection',
      },
      {
        name: 'Thời gian tự động làm mới',
        url: 'manage/auto-refresh-time',
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
        url: 'balance-information',
      },
      {
        name: 'Nạp tiền vào tài khoản',
        url: 'top-up',
      },
      {
        name: 'Lịch sử nạp tiền',
        url: 'recharge-history',
      },
      {
        name: 'Mua gói dịch vụ',
        url: 'service-package',
      },
      {
        name: 'Dùng mã quà tặng / KM',
        url: 'code-promotion',
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
        url: 'request/call-back',
      },
      {
        name: 'Yêu cầu tư vấn',
        url: 'request/advise',
      },
    ],
  },
];
