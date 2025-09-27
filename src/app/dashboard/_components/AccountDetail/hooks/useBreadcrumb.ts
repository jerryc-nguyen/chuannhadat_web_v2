import { useBreadcrumb } from '@common/hooks/useBreadcrumb';
import { getAccountDetailBreadcrumb, getAccountSettingsTabBreadcrumb, ACCOUNT_DETAIL_BREADCRUMBS } from '../helpers';

/**
 * Custom hook for account detail breadcrumbs
 * @param type - The breadcrumb type
 * @param params - Additional parameters (for future extensibility)
 */
export const useAccountDetailBreadcrumb = (
  type: keyof typeof ACCOUNT_DETAIL_BREADCRUMBS,
  params?: Record<string, unknown>
) => {
  const breadcrumbItems = getAccountDetailBreadcrumb(type, params);
  return useBreadcrumb(breadcrumbItems);
};

/**
 * Specific hooks for each account detail feature
 * These provide a more semantic API for components
 */

export const useAccountSettingsBreadcrumb = () => {
  return useAccountDetailBreadcrumb('ACCOUNT_SETTINGS');
};

export const useNotificationsBreadcrumb = () => {
  return useAccountDetailBreadcrumb('NOTIFICATIONS');
};

/**
 * Dynamic breadcrumb hook for account settings tabs
 * @param tabValue - Current active tab value
 */
export const useAccountSettingsTabBreadcrumb = (tabValue?: string) => {
  const breadcrumbItems = getAccountSettingsTabBreadcrumb(tabValue);
  return useBreadcrumb(breadcrumbItems);
};

/**
 * Individual tab breadcrumb hooks for specific use cases
 */

export const usePersonalTabBreadcrumb = () => {
  return useAccountDetailBreadcrumb('PERSONAL_TAB');
};

export const useContactInfoTabBreadcrumb = () => {
  return useAccountDetailBreadcrumb('CONTACT_INFO_TAB');
};

export const useEmailTabBreadcrumb = () => {
  return useAccountDetailBreadcrumb('EMAIL_TAB');
};

export const usePhoneTabBreadcrumb = () => {
  return useAccountDetailBreadcrumb('PHONE_TAB');
};

export const usePasswordTabBreadcrumb = () => {
  return useAccountDetailBreadcrumb('PASSWORD_TAB');
};

export const useReferFriendTabBreadcrumb = () => {
  return useAccountDetailBreadcrumb('REFER_FRIEND_TAB');
};
