import { savesApi } from '@frontend/CategoryPage/api/saves';
import { ISavedProductsResponse, ISavesSummaryResponse, ActionSaveProduct } from '@frontend/features/product-detail-actions/save-post/types';

/**
 * Favorites API wrapper
 * Provides convenient API methods for the FavoriteIcon component
 */
export const favoritesApi = {
  /**
   * Get saved posts summary
   */
  getSavedSummary: async (): Promise<ISavesSummaryResponse> => {
    return savesApi.savedSummary();
  },

  /**
   * Get list of saved posts
   */
  getSavedPosts: async (): Promise<ISavedProductsResponse> => {
    return savesApi.savedPosts();
  },

  /**
   * Remove a saved post (unlike)
   */
  removeSavedPost: async (productUid: string) => {
    return savesApi.savePost({
      product_uid: productUid,
      action: ActionSaveProduct.Unlike,
    });
  },
};
