import { ACCOUNT_DETAIL_BREADCRUMBS } from "./constants/breadcrumbs";
import { IBreadcrumbItem } from "@dashboard/DashboardLayout/states/breadcrumbAtom";

/**
 * Re-export breadcrumb utilities for easy access
 * This allows components to import breadcrumb helpers from the main helpers file
 */
export {
  ACCOUNT_DETAIL_BREADCRUMBS,
} from './constants/breadcrumbs';

/**
 * Helper function to get breadcrumb by type
 * @param type - The breadcrumb type
 * @param _params - Additional parameters (for future extensibility)
 */
export const getAccountDetailBreadcrumb = (
  type: keyof typeof ACCOUNT_DETAIL_BREADCRUMBS,
  _params?: Record<string, unknown>
): IBreadcrumbItem[] => {
  switch (type) {
    case 'ACCOUNT_SETTINGS':
      return ACCOUNT_DETAIL_BREADCRUMBS.ACCOUNT_SETTINGS;
    case 'NOTIFICATIONS':
      return ACCOUNT_DETAIL_BREADCRUMBS.NOTIFICATIONS;
    case 'PERSONAL_TAB':
      return ACCOUNT_DETAIL_BREADCRUMBS.PERSONAL_TAB;
    case 'CONTACT_INFO_TAB':
      return ACCOUNT_DETAIL_BREADCRUMBS.CONTACT_INFO_TAB;
    case 'EMAIL_TAB':
      return ACCOUNT_DETAIL_BREADCRUMBS.EMAIL_TAB;
    case 'PHONE_TAB':
      return ACCOUNT_DETAIL_BREADCRUMBS.PHONE_TAB;
    case 'PASSWORD_TAB':
      return ACCOUNT_DETAIL_BREADCRUMBS.PASSWORD_TAB;
    case 'REFER_FRIEND_TAB':
      return ACCOUNT_DETAIL_BREADCRUMBS.REFER_FRIEND_TAB;
    default:
      return ACCOUNT_DETAIL_BREADCRUMBS.ACCOUNT_SETTINGS;
  }
};

/**
 * Utility functions for account detail features
 * Add more helper functions here as needed
 */

/**
 * Get breadcrumb for account settings tab
 * @param tabValue - The tab value from AccountSettingTab enum
 */
export const getAccountSettingsTabBreadcrumb = (tabValue?: string): IBreadcrumbItem[] => {
  if (!tabValue || tabValue === 'personal-wall') {
    return ACCOUNT_DETAIL_BREADCRUMBS.PERSONAL_TAB;
  }

  switch (tabValue) {
    case 'contact-infor':
      return ACCOUNT_DETAIL_BREADCRUMBS.CONTACT_INFO_TAB;
    case 'email':
      return ACCOUNT_DETAIL_BREADCRUMBS.EMAIL_TAB;
    case 'phone-number':
      return ACCOUNT_DETAIL_BREADCRUMBS.PHONE_TAB;
    case 'password':
      return ACCOUNT_DETAIL_BREADCRUMBS.PASSWORD_TAB;
    case 'refer-friend':
      return ACCOUNT_DETAIL_BREADCRUMBS.REFER_FRIEND_TAB;
    default:
      return ACCOUNT_DETAIL_BREADCRUMBS.ACCOUNT_SETTINGS;
  }
};

/**
 * Validate email format
 * @param email - Email to validate
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, message: 'Email không được để trống' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Email không đúng định dạng' };
  }

  return { isValid: true };
};

/**
 * Validate phone number format (Vietnamese)
 * @param phone - Phone number to validate
 */
export const validatePhoneNumber = (phone: string): { isValid: boolean; message?: string } => {
  // Vietnamese phone number regex (supports various formats)
  const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;

  if (!phone) {
    return { isValid: false, message: 'Số điện thoại không được để trống' };
  }

  // Remove spaces and dashes for validation
  const cleanPhone = phone.replace(/[\s-]/g, '');

  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, message: 'Số điện thoại không đúng định dạng' };
  }

  return { isValid: true };
};

/**
 * Validate password strength
 * @param password - Password to validate
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'Mật khẩu không được để trống' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }

  if (password.length > 50) {
    return { isValid: false, message: 'Mật khẩu không được quá 50 ký tự' };
  }

  return { isValid: true };
};

/**
 * Format display name
 * @param firstName - First name
 * @param lastName - Last name
 */
export const formatDisplayName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return '';
  if (!firstName) return lastName || '';
  if (!lastName) return firstName;
  return `${lastName} ${firstName}`.trim();
};
