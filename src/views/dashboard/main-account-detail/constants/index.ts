import { LuContact, LuLock, LuMail, LuPhone, LuUserCog2, LuUserPlus2 } from 'react-icons/lu';
import broker from '@assets/images/broker.png';
import personal from '@assets/images/personal.png';
import { CustomerGender, CustomerType } from '@common/types';
import {
  ContactInfor,
  EmailTab,
  PasswordTab,
  PersonalTab,
  PhoneNumberTab,
  ReferFriend,
} from '../account-settings/components';
export enum AccountSettingTab {
  PERSONAL_WALL = 'personal-wall',
  CONNECT_SOCIAL = 'connect-social',
  CONTACT_INFO = 'contact-infor',
  EMAIL = 'email',
  PHONE_NUMBER = 'phone-number',
  PASSWORD = 'password',
  REFER_FRIEND = 'refer-friend',
}
export const listTabAccountSetting = [
  {
    title: 'Trang cá nhân',
    tabValue: AccountSettingTab.PERSONAL_WALL,
    icon: LuUserCog2,
    tabComponent: PersonalTab,
  },
  // {
  //   title: 'Liên kết tài khoản',
  //   tabValue: AccountSettingTab.CONNECT_SOCIAL,
  //   icon: IoShareSocial,
  //   tabComponent: ConnectSocial,
  // },
  {
    title: 'Thông tin liên hệ',
    tabValue: AccountSettingTab.CONTACT_INFO,
    icon: LuContact,
    tabComponent: ContactInfor,
  },
  {
    title: 'Email',
    tabValue: AccountSettingTab.EMAIL,
    icon: LuMail,
    tabComponent: EmailTab,
  },
  {
    title: 'Số điện thoại',
    tabValue: AccountSettingTab.PHONE_NUMBER,
    icon: LuPhone,
    tabComponent: PhoneNumberTab,
  },
  {
    title: 'Mật khẩu',
    tabValue: AccountSettingTab.PASSWORD,
    icon: LuLock,
    tabComponent: PasswordTab,
  },
  {
    title: 'Giới thiệu bạn bè',
    tabValue: AccountSettingTab.REFER_FRIEND,
    icon: LuUserPlus2,
    tabComponent: ReferFriend,
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
