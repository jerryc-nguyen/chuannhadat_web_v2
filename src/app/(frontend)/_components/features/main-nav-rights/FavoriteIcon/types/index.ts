import { ISavedProductsResponse, ISavesSummaryResponse } from '@frontend/features/product-detail-actions/save-post/types';
import { IViewedProductDetail } from '@frontend/CategoryPage/mobile/searchs/type';
import { OptionForSelect } from '@common/types';

// Re-export types from existing modules for convenience
export type { ISavedProductsResponse, ISavesSummaryResponse, IViewedProductDetail, OptionForSelect };

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
  savedPosts?: ISavedProductsResponse;
  viewedPosts: IViewedProductDetail[];
  viewedPagination?: any;
}

// View options for the tab selector
export const VIEW_OPTIONS: OptionForSelect[] = [
  { text: 'Tin đã lưu', value: 'saved' },
  { text: 'Tin đã xem', value: 'viewed' },
];
