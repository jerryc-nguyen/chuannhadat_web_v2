import { POST_MANAGEMENT_BREADCRUMBS } from "./constants/breadcrumbs";
import { IBreadcrumbItem } from "@dashboard/DashboardLayout/states/breadcrumbAtom";

/**
 * Re-export breadcrumb utilities for easy access
 * This allows components to import breadcrumb helpers from the main helpers file
 */
export {
  POST_MANAGEMENT_BREADCRUMBS,
} from './constants/breadcrumbs';



/**
 * Helper function to get breadcrumb by type
 * @param type - The breadcrumb type
 * @param params - Additional parameters (like post title for edit)
 */
export const getPostManagementBreadcrumb = (
  type: keyof typeof POST_MANAGEMENT_BREADCRUMBS,
  params?: { postTitle?: string }
): IBreadcrumbItem[] => {
  switch (type) {
    case 'LIST':
      return POST_MANAGEMENT_BREADCRUMBS.LIST;
    case 'NEW_POST':
      return POST_MANAGEMENT_BREADCRUMBS.NEW_POST;
    case 'EDIT_POST':
      return POST_MANAGEMENT_BREADCRUMBS.EDIT_POST(params?.postTitle);
    case 'AUTO_REFRESH':
      return POST_MANAGEMENT_BREADCRUMBS.AUTO_REFRESH;
    default:
      return POST_MANAGEMENT_BREADCRUMBS.LIST;
  }
};
