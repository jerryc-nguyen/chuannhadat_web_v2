import { FINANCIAL_MANAGEMENT_BREADCRUMBS } from "./constants/breadcrumbs";
import { IBreadcrumbItem } from "@dashboard/DashboardLayout/states/breadcrumbAtom";

/**
 * Re-export breadcrumb utilities for easy access
 * This allows components to import breadcrumb helpers from the main helpers file
 */
export {
  FINANCIAL_MANAGEMENT_BREADCRUMBS,
} from './constants/breadcrumbs';

/**
 * Helper function to get breadcrumb by type
 * @param type - The breadcrumb type
 * @param _params - Additional parameters (for future extensibility)
 */
export const getFinancialManagementBreadcrumb = (
  type: keyof typeof FINANCIAL_MANAGEMENT_BREADCRUMBS,
  _params?: Record<string, unknown>
): IBreadcrumbItem[] => {
  switch (type) {
    case 'BALANCE_SUMMARY':
      return FINANCIAL_MANAGEMENT_BREADCRUMBS.BALANCE_SUMMARY;
    case 'TOP_UP':
      return FINANCIAL_MANAGEMENT_BREADCRUMBS.TOP_UP;
    case 'TOP_UP_HISTORY':
      return FINANCIAL_MANAGEMENT_BREADCRUMBS.TOP_UP_HISTORY;
    case 'PRICING_PLANS':
      return FINANCIAL_MANAGEMENT_BREADCRUMBS.PRICING_PLANS;
    case 'TRANSACTION_HISTORY':
      return FINANCIAL_MANAGEMENT_BREADCRUMBS.TRANSACTION_HISTORY;
    default:
      return FINANCIAL_MANAGEMENT_BREADCRUMBS.BALANCE_SUMMARY;
  }
};

/**
 * Utility functions for financial management features
 * Add more helper functions here as needed
 */

/**
 * Format currency amount for display
 * @param amount - The amount to format
 * @param currency - The currency symbol (default: 'Xu')
 */
export const formatCurrency = (amount: number | string, currency = 'Xu'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return `0 ${currency}`;

  return `${numAmount.toLocaleString('vi-VN')} ${currency}`;
};

/**
 * Parse currency string to number
 * @param currencyString - String like "1,000,000 Xu"
 */
export const parseCurrency = (currencyString: string): number => {
  const numericString = currencyString.replace(/[^\d]/g, '');
  return parseInt(numericString) || 0;
};

/**
 * Validate top-up amount
 * @param amount - The amount to validate
 * @param minAmount - Minimum allowed amount
 * @param maxAmount - Maximum allowed amount
 */
export const validateTopUpAmount = (
  amount: number,
  minAmount = 10000,
  maxAmount = 10000000
): { isValid: boolean; message?: string } => {
  if (amount < minAmount) {
    return {
      isValid: false,
      message: `Số tiền tối thiểu là ${formatCurrency(minAmount)}`
    };
  }

  if (amount > maxAmount) {
    return {
      isValid: false,
      message: `Số tiền tối đa là ${formatCurrency(maxAmount)}`
    };
  }

  return { isValid: true };
};
