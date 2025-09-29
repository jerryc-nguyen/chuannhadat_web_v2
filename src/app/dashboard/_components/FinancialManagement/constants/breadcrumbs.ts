import { DASHBOARD_ROUTES } from '@common/router';
import { IBreadcrumbItem } from '@dashboard/DashboardLayout/states/breadcrumbAtom';

/**
 * Centralized breadcrumb definitions for Financial Management
 * This ensures consistency and makes maintenance easier
 */
export const FINANCIAL_MANAGEMENT_BREADCRUMBS = {
  // Base breadcrumbs that are common across financial management
  BASE: [] as IBreadcrumbItem[], // Will be populated by dashboard default

  // Balance summary page
  BALANCE_SUMMARY: [
    {
      link: DASHBOARD_ROUTES.balance.summary,
      title: 'Thông tin số dư',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  // Top-up page
  TOP_UP: [
    {
      link: DASHBOARD_ROUTES.balance.summary,
      title: 'Thông tin số dư',
      isActive: false,
    },
    {
      link: DASHBOARD_ROUTES.balance.topup,
      title: 'Nạp tiền vào tài khoản',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  // Top-up history page
  TOP_UP_HISTORY: [
    {
      link: DASHBOARD_ROUTES.balance.summary,
      title: 'Thông tin số dư',
      isActive: false,
    },
    {
      link: DASHBOARD_ROUTES.balance.topUpHistory,
      title: 'Lịch sử nạp tiền',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  // Pricing plans page
  PRICING_PLANS: [
    {
      link: DASHBOARD_ROUTES.balance.summary,
      title: 'Thông tin số dư',
      isActive: false,
    },
    {
      link: DASHBOARD_ROUTES.balance.pricingPlans,
      title: 'Mua gói dịch vụ',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  // Transaction history (if you have this feature)
  TRANSACTION_HISTORY: [
    {
      link: DASHBOARD_ROUTES.balance.summary,
      title: 'Thông tin số dư',
      isActive: false,
    },
    {
      link: '#', // Replace with actual transaction history route when available
      title: 'Lịch sử giao dịch',
      isActive: true,
    },
  ] as IBreadcrumbItem[],
} as const;
