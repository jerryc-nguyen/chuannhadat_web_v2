import { DASHBOARD_ROUTES } from '@common/router';
import { IBreadcrumbItem } from '@dashboard/DashboardLayout/states/breadcrumbAtom';

/**
 * Centralized breadcrumb definitions for Post Management
 * This ensures consistency and makes maintenance easier
 */
export const POST_MANAGEMENT_BREADCRUMBS = {
  // Base breadcrumbs that are common across post management
  BASE: [] as IBreadcrumbItem[], // Will be populated by dashboard default

  // List/Index page
  LIST: [
    {
      link: DASHBOARD_ROUTES.posts.index,
      title: 'Danh sách tin đăng',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  // New post page
  NEW_POST: [
    {
      link: DASHBOARD_ROUTES.posts.index,
      title: 'Danh sách tin đăng',
      isActive: false,
    },
    {
      link: DASHBOARD_ROUTES.posts.new,
      title: 'Đăng tin mới',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  // Edit post page (dynamic - requires post title)
  EDIT_POST: (postTitle?: string) => [
    {
      link: DASHBOARD_ROUTES.posts.index,
      title: 'Danh sách tin đăng',
      isActive: false,
    },
    {
      link: '#', // Current page, no navigation needed
      title: postTitle ? `Chỉnh sửa: ${postTitle}` : 'Chỉnh sửa tin đăng',
      isActive: true,
    },
  ] as IBreadcrumbItem[],

  // Auto refresh settings
  AUTO_REFRESH: [
    {
      link: DASHBOARD_ROUTES.posts.index,
      title: 'Danh sách tin đăng',
      isActive: false,
    },
    {
      link: DASHBOARD_ROUTES.posts.autoRefresh,
      title: 'Tự động làm mới',
      isActive: true,
    },
  ] as IBreadcrumbItem[]
} as const;
