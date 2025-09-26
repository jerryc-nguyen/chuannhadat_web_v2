import { useBreadcrumb } from '@common/hooks/useBreadcrumb';
import { getFinancialManagementBreadcrumb, FINANCIAL_MANAGEMENT_BREADCRUMBS } from '../helpers';

/**
 * Custom hook for financial management breadcrumbs
 * @param type - The breadcrumb type
 * @param params - Additional parameters (for future extensibility)
 */
export const useFinancialManagementBreadcrumb = (
  type: keyof typeof FINANCIAL_MANAGEMENT_BREADCRUMBS,
  params?: Record<string, any>
) => {
  const breadcrumbItems = getFinancialManagementBreadcrumb(type, params);
  return useBreadcrumb(breadcrumbItems);
};

/**
 * Specific hooks for each financial management feature
 * These provide a more semantic API for components
 */

export const useBalanceSummaryBreadcrumb = () => {
  return useFinancialManagementBreadcrumb('BALANCE_SUMMARY');
};

export const useTopUpBreadcrumb = () => {
  return useFinancialManagementBreadcrumb('TOP_UP');
};

export const useTopUpHistoryBreadcrumb = () => {
  return useFinancialManagementBreadcrumb('TOP_UP_HISTORY');
};

export const usePricingPlansBreadcrumb = () => {
  return useFinancialManagementBreadcrumb('PRICING_PLANS');
};

export const useTransactionHistoryBreadcrumb = () => {
  return useFinancialManagementBreadcrumb('TRANSACTION_HISTORY');
};
