import { POST_MANAGEMENT_BREADCRUMBS } from "./constants/breadcrumbs";
import { IBreadcrumbItem } from "@dashboard/DashboardLayout/states/breadcrumbAtom";
import { IPostForm } from "../types";

export const convertToProductFormData = (productData: A): IPostForm => {
  return {
    business_type: productData.business_type,
    category_type: productData.category_type,
    title: productData.title,
    description: productData.description,
    area: productData.area,
    phap_ly: productData.phap_ly,
    price_in_vnd: productData.price_in_vnd,
    city_id: productData.city_id,
    district_id: productData.district_id,
    ward_id: productData.ward_id,
    street_id: productData.street_id,
    project_id: productData.project_id,
    full_address: productData.full_address,
    bedrooms_count: productData.bedrooms_count,
    bathrooms_count: productData.bathrooms_count,
    facade: productData.facade,
    entrance: productData.entrance,
    floors_count: productData.floors_count,
    direction: productData.direction,
    furniture: productData.furniture,
    image_ids: productData.image_ids,
    youtube_url: productData.youtube_url,
  }
}

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
