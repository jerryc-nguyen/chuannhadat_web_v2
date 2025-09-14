import { ISavedProducts, IProductList, OptionForSelect, IResponseData, IPagination } from '@common/types';

/**
 * Type for viewed product history/details
 * Uses the consolidated IProductDetail type
 */
export interface IViewedProductDetail {
  id: number;
  product: IProductList;
  created_at: string;
  activity_id: number;
}

// Response types - using generic IResponseData consistently
export type ISavesSummaryResponse = IResponseData<{ saved_product_uids: string[] }>;

// Re-export types from existing modules for convenience
export type { OptionForSelect };

// Favorite-specific types
export interface FavoriteState {
  isOpen: boolean;
  selectedTab: OptionForSelect;
  loadingDeleteUid: string;
  showBadge: boolean;
}

export interface FavoriteActions {
  setIsOpen: (isOpen: boolean) => void;
  setSelectedTab: (tab: OptionForSelect) => void;
  removeSavedPost: (uid: string) => Promise<void>;
  removeViewedPost: (uid: string) => Promise<void>;
}

export interface FavoriteData {
  savedSummary?: ISavesSummaryResponse['data'];
  savedPosts?: {
    data: ISavedProducts[];
    pagination: IPagination;
  };
  viewedPosts: IViewedProductDetail[];
  viewedPagination?: IPagination;
}

// View options for the tab selector
export const VIEW_OPTIONS: OptionForSelect[] = [
  { text: 'Tin đã lưu', value: 'saved' },
  { text: 'Tin đã xem', value: 'viewed' },
];
