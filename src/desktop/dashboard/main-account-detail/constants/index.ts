import { LuContact, LuLock, LuMail, LuPhone, LuUserCog2, LuUserPlus2 } from 'react-icons/lu';
import broker from '@assets/images/broker.png';
import personal from '@assets/images/personal.png';
import { CustomerGender, CustomerType } from '@common/types';

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
