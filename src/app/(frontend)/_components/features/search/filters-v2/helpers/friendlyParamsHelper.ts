import { FilterState } from '../../filter-conditions/types';

export const FRIENDLY_VALUES = {
  sell: 'mua_ban',
  rent: 'cho_thue',
  west: 'huong_tay',
  west_south: 'huong_tay_nam',
  west_north: 'huong_tay_bac',
  east: 'huong_dong',
  east_south: 'huong_dong_nam',
  east_north: 'huong_dong_bac',
  south: 'huong_nam',
  north: 'huong_bac',
  full_furniture: 'noi_that_day_du',
  basic_furniture: 'hoan_thien_co_ban',
  unfinished_furniture: 'ban_giao_tho',
}
/**
 * Helper functions to build user-friendly query parameters from filter state
 * Each function handles a specific filter field and returns the appropriate parameter
 */

/**
 * Formats price value to Vietnamese format (tr = triệu, ty = tỷ)
 */
export function formatPrice(price: number): string {
  if (price >= 1_000_000_000) {
    const ty = price / 1_000_000_000;
    return ty % 1 === 0 ? `${ty}ty` : `${ty.toFixed(1)}ty`;
  } else if (price >= 1_000_000) {
    const tr = price / 1_000_000;
    return tr % 1 === 0 ? `${tr}tr` : `${tr.toFixed(1)}tr`;
  }
  return `${price}`;
}

/**
 * Builds price parameter from filter state
 */
export function buildPriceParam(filterState: FilterState): string | undefined {
  if (filterState.price?.value && filterState.price.value !== 'all') {
    return filterState.price.value as string;
  } else if (filterState.price?.range) {
    const { min, max } = filterState.price.range;
    if (min !== undefined && max !== undefined) {
      return `${formatPrice(min)}-${formatPrice(max)}`;
    }
  }
  return undefined;
}

/**
 * Builds area parameter from filter state
 */
export function buildAreaParam(filterState: FilterState): string | undefined {
  if (filterState.area?.value && filterState.area.value !== 'all') {
    return filterState.area.value as string;
  } else if (filterState.area?.range) {
    const { min, max } = filterState.area.range;
    if (min !== undefined && max !== undefined) {
      return `${min}-${max}m2`;
    }
  }
  return undefined;
}

/**
 * Builds bedroom parameter from filter state
 */
export function buildBedroomParam(filterState: FilterState): string | undefined {
  if (filterState.bed?.value && filterState.bed.value !== 'all') {
    return filterState.bed.value as string;
  }
  return undefined;
}

/**
 * Builds bathroom parameter from filter state
 */
export function buildBathroomParam(filterState: FilterState): string | undefined {
  if (filterState.bath?.value && filterState.bath.value !== 'all') {
    return filterState.bath.value as string;
  }
  return undefined;
}

/**
 * Builds direction parameter from filter state
 */
export function buildDirectionParam(filterState: FilterState): string | undefined {
  if (filterState.direction?.value && filterState.direction.value !== 'all') {
    const directionValue = filterState.direction.value as string;
    return FRIENDLY_VALUES[directionValue as keyof typeof FRIENDLY_VALUES];
  }
  return undefined;
}

/**
 * Builds business type parameter from filter state
 */
export function buildBusinessTypeParam(filterState: FilterState): string | undefined {
  if (filterState.businessType?.value && filterState.businessType.value !== 'all') {
    return FRIENDLY_VALUES[filterState.businessType.value as keyof typeof FRIENDLY_VALUES];
  }
  return undefined;
}

/**
 * Builds category type parameter from filter state
 */
export function buildCategoryTypeParam(filterState: FilterState): string | undefined {
  if (filterState.categoryType?.value && filterState.categoryType.value !== 'all') {
    return filterState.categoryType.value as string;
  }
  return undefined;
}

/**
 * Builds city parameter from filter state
 */
export function buildCityParam(filterState: FilterState): string | undefined {
  if (filterState.city?.value) {
    return filterState.city.value as string;
  }
  return undefined;
}

/**
 * Builds district parameter from filter state
 */
export function buildDistrictParam(filterState: FilterState): string | undefined {
  if (filterState.district?.value) {
    return filterState.district.value as string;
  }
  return undefined;
}

/**
 * Builds ward parameter from filter state
 */
export function buildWardParam(filterState: FilterState): string | undefined {
  if (filterState.ward?.value) {
    return filterState.ward.value as string;
  }
  return undefined;
}

/**
 * Builds project parameter from filter state
 */
export function buildProjectParam(filterState: FilterState): string | undefined {
  if (filterState.project?.value) {
    return filterState.project.value as string;
  }
  return undefined;
}

/**
 * Main function that builds all user-friendly query parameters from filter state
 * Returns an object with Vietnamese parameter names for URL display
 */
export function buildFriendlyParams(filterState: FilterState): Record<string, string> {
  const results: Record<string, string> = {};

  // Price filter
  const priceParam = buildPriceParam(filterState);
  if (priceParam) {
    results.gia = priceParam;
  }

  // Area filter
  const areaParam = buildAreaParam(filterState);
  if (areaParam) {
    results.dien_tich = areaParam;
  }

  // Bedroom filter
  const bedroomParam = buildBedroomParam(filterState);
  if (bedroomParam) {
    results.phong_ngu = bedroomParam;
  }

  // Bathroom filter
  const bathroomParam = buildBathroomParam(filterState);
  if (bathroomParam) {
    results.phong_tam = bathroomParam;
  }

  // Direction filter
  const directionParam = buildDirectionParam(filterState);
  if (directionParam) {
    results.huong = directionParam;
  }

  // Business type filter
  const businessTypeParam = buildBusinessTypeParam(filterState);
  if (businessTypeParam) {
    results.hinh_thuc = businessTypeParam;
  }

  // Category type filter
  const categoryTypeParam = buildCategoryTypeParam(filterState);
  if (categoryTypeParam) {
    results.loai_bds = categoryTypeParam;
  }

  // Location filters
  const cityParam = buildCityParam(filterState);
  if (cityParam) {
    results.thanh_pho = cityParam;
  }

  const districtParam = buildDistrictParam(filterState);
  if (districtParam) {
    results.quan_huyen = districtParam;
  }

  const wardParam = buildWardParam(filterState);
  if (wardParam) {
    results.phuong_xa = wardParam;
  }

  // Project filter
  const projectParam = buildProjectParam(filterState);
  if (projectParam) {
    results.du_an = projectParam;
  }

  return results;
}
