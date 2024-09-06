import { CustomerGender, CustomerType } from '@models/enums';
import {
  LuBadgeDollarSign,
  LuContact,
  LuFileText,
  LuLock,
  LuMail,
  LuPhone,
  LuRepeat,
  LuUserCircle,
  LuUserCog2,
  LuUserPlus2,
} from 'react-icons/lu';
import broker from '@assets/images/broker.png';
import personal from '@assets/images/personal.png';
import { INavLinkGroup } from '@models/interface/INavLinkGroups';

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

export const QUERY_KEY = {
  LOGIN: ['login'],
  USER: ['user'],
  BALANCE: ['balance'],
};

export const listNavDashboard: INavLinkGroup[] = [
  {
    name: 'Thông tin cá nhân',
    url: '',
    icon: LuUserCircle,
    links: [
      {
        name: 'Cài đặt tài khoản',
        url: 'account-settings',
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
        url: 'manage-post/new-post',
      },
      {
        name: 'Danh sách tin',
        url: 'manage-post/collection-post',
      },
      {
        name: 'Hashtag của bạn',
        url: 'manage-post/collection',
      },
      {
        name: 'Thời gian tự động làm mới',
        url: 'manage-post/auto-refresh',
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
export const listTabAccountSetting = [
  {
    title: 'Trang cá nhân',
    tabValue: 'personal-wall',
    icon: LuUserCog2,
  },
  {
    title: 'Thông tin liên hệ',
    tabValue: 'contact-infor',
    icon: LuContact,
  },
  {
    title: 'Email',
    tabValue: 'email',
    icon: LuMail,
  },
  {
    title: 'Số điện thoại',
    tabValue: 'phone-number',
    icon: LuPhone,
  },
  {
    title: 'Mật khẩu',
    tabValue: 'password',
    icon: LuLock,
  },
  {
    title: 'Giới thiệu bạn bè',
    tabValue: 'refer-friend',
    icon: LuUserPlus2,
  },
];

export const listCustomerType = [
  {
    id: CustomerType.Customer,
    title: 'Cá nhân',
    content: 'Bạn có nhu cầu mua, bán hoặc thuê bất động sản cho mục đích cá nhân như ở, đầu tư',
    icon: personal,
  },
  {
    id: CustomerType.Broker,
    title: 'Môi giới',
    content: 'Bạn người có chuyên môn, làm trung gian giúp kết nối giữa người mua và người bán',
    icon: broker,
  },
];
export const listCustomerGender = [
  {
    id: CustomerGender.Male,
    title: 'Nam',
  },
  {
    id: CustomerGender.FeMale,
    title: 'Nữ',
  },
];
