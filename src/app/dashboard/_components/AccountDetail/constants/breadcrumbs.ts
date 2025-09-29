import { DASHBOARD_ROUTES } from '@common/router';
import { IBreadcrumbItem } from '@dashboard/DashboardLayout/states/breadcrumbAtom';

/**
 * Centralized breadcrumb definitions for Account Detail Management
 * This ensures consistency and makes maintenance easier
 */
export const ACCOUNT_DETAIL_BREADCRUMBS = {
  // Base breadcrumbs that are common across account management
  BASE: [] as IBreadcrumbItem[], // Will be populated by dashboard default

  // Account settings page (main page with tabs)
  ACCOUNT_SETTINGS: [
    {
      link: DASHBOARD_ROUTES.profile.accountSettings,
      title: 'Cài đặt tài khoản',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  // Notifications page
  NOTIFICATIONS: [
    {
      link: DASHBOARD_ROUTES.profile.notifications,
      title: 'Thông báo',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  // Account settings with specific tab context (for future use if needed)
  PERSONAL_TAB: [
    {
      link: DASHBOARD_ROUTES.profile.accountSettings,
      title: 'Cài đặt tài khoản',
      isActive: false,
    },
    {
      link: `${DASHBOARD_ROUTES.profile.accountSettings}?tab=personal-wall`,
      title: 'Trang cá nhân',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  CONTACT_INFO_TAB: [
    {
      link: DASHBOARD_ROUTES.profile.accountSettings,
      title: 'Cài đặt tài khoản',
      isActive: false,
    },
    {
      link: `${DASHBOARD_ROUTES.profile.accountSettings}?tab=contact-infor`,
      title: 'Thông tin liên hệ',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  EMAIL_TAB: [
    {
      link: DASHBOARD_ROUTES.profile.accountSettings,
      title: 'Cài đặt tài khoản',
      isActive: false,
    },
    {
      link: `${DASHBOARD_ROUTES.profile.accountSettings}?tab=email`,
      title: 'Email',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  PHONE_TAB: [
    {
      link: DASHBOARD_ROUTES.profile.accountSettings,
      title: 'Cài đặt tài khoản',
      isActive: false,
    },
    {
      link: `${DASHBOARD_ROUTES.profile.accountSettings}?tab=phone-number`,
      title: 'Số điện thoại',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  PASSWORD_TAB: [
    {
      link: DASHBOARD_ROUTES.profile.accountSettings,
      title: 'Cài đặt tài khoản',
      isActive: false,
    },
    {
      link: `${DASHBOARD_ROUTES.profile.accountSettings}?tab=password`,
      title: 'Mật khẩu',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  REFER_FRIEND_TAB: [
    {
      link: DASHBOARD_ROUTES.profile.accountSettings,
      title: 'Cài đặt tài khoản',
      isActive: false,
    },
    {
      link: `${DASHBOARD_ROUTES.profile.accountSettings}?tab=refer-friend`,
      title: 'Giới thiệu bạn bè',
      isActive: true,
    },
  ] as IBreadcrumbItem[],
} as const;
