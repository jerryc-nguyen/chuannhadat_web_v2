import broker from '@assets/images/broker.png';
import personal from '@assets/images/personal.png';
import { CustomerGender, CustomerType } from '@common/types';
import { Contact, Lock, Mail, Phone, UserCog2, UserPlus2 } from 'lucide-react';
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
    icon: UserCog2,
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
    icon: Contact,
    tabComponent: ContactInfor,
  },
  {
    title: 'Email',
    tabValue: AccountSettingTab.EMAIL,
    icon: Mail,
    tabComponent: EmailTab,
  },
  {
    title: 'Số điện thoại',
    tabValue: AccountSettingTab.PHONE_NUMBER,
    icon: Phone,
    tabComponent: PhoneNumberTab,
  },
  {
    title: 'Mật khẩu',
    tabValue: AccountSettingTab.PASSWORD,
    icon: Lock,
    tabComponent: PasswordTab,
  },
  {
    title: 'Giới thiệu bạn bè',
    tabValue: AccountSettingTab.REFER_FRIEND,
    icon: UserPlus2,
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
