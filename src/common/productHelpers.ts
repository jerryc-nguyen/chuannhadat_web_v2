export function featureProductImage(product: A): string | null {
  if (product.featured_image_url) {
    return product.featured_image_url;
  } else if (product.images && product.images.length > 0) {
    return product.images[0]['url'];
  } else {
    return null;
  }
}

/**
 * Check if a property is land or land project
 * @param categoryType The property category type
 * @returns boolean
 */
export function isLandProperty(categoryType: string): boolean {
  return categoryType === 'dat' || categoryType === 'dat_nen_du_an';
}

/**
 * Check if a property is a house type
 * @param categoryType The property category type
 * @returns boolean
 */
export function isHouseProperty(categoryType: string): boolean {
  return (
    categoryType === 'nha_rieng' ||
    categoryType === 'nha_mat_pho' ||
    categoryType === 'biet_thu_lien_ke' ||
    categoryType === 'nha_tro_phong_tro' ||
    categoryType === 'van_phong' ||
    categoryType === 'cua_hang_kiot'
  );
}

/**
 * Check if a property is an apartment
 * @param categoryType The property category type
 * @returns boolean
 */
export function isApartmentProperty(categoryType: string): boolean {
  return categoryType === 'can_ho_chung_cu';
}
