/**
 * Utility function to exclude specific fields from filter parameters based on included fields list.
 * This is used when building SEO URLs where certain parameters are already included in the URL path
 * and should not be duplicated in the query string.
 * 
 * @param params - The filter parameters object
 * @param includedFields - Array of field names that are already included in the URL path
 * @returns A new object with the specified fields excluded
 * 
 * @example
 * const params = { hinh_thuc: 'ban', gia: '1-2', city_id: '1' };
 * const included = ['main', 'khu_vuc'];
 * const result = excludeIncludedFields(params, included);
 * // result: { gia: '1-2' } (hinh_thuc and city_id are excluded)
 */
export function filterFields(
  params: Record<string, any>,
  includedFields: string[]
): Record<string, any> {
  const clonedParams = { ...params };

  if (includedFields.length === 0) {
    return params;
  }

  // Remove main property type fields if included in URL path
  if (includedFields.includes('main')) {
    delete clonedParams.hinh_thuc;  // Transaction type (buy/rent)
    delete clonedParams.loai_bds;   // Property type
  }

  // Remove price field if included in URL path
  if (includedFields.includes('gia')) {
    delete clonedParams.gia;
  }

  // Remove area field if included in URL path
  if (includedFields.includes('dien_tich')) {
    delete clonedParams['dien_tich'];
  }

  // Remove location fields if included in URL path
  if (includedFields.includes('khu_vuc')) {
    delete clonedParams['city_id'];
    delete clonedParams['district_id'];
    delete clonedParams['ward_id'];
    delete clonedParams['street_id'];
    delete clonedParams['project_id'];
  }

  return clonedParams;
}
