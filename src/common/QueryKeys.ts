// Centralized query key builders for SSR prefetches
// Keep shapes aligned with client hooks to ensure hydration matches

export const QueryKeys = {
  // Category/Search listing
  categoryPosts: (filterParams: Record<string, any>) => ['useQueryPostsV2', filterParams] as const,
  // Search results preview count (used by Header/FilterChips/Footer)
  searchCount: (filterParams: Record<string, any>) => ['FooterBtsButton', filterParams, true, true] as const,

  // Profile listing
  profilePosts: (
    filterParams: Record<string, any>,
    profileSlug: string,
    page = 1
  ) => ['profile-post', { filterParams, profileSlug }, page] as const,

  // Post detail
  postDetail: (productUid: string) => ['get-detail-post', productUid] as const,
  postsSameAuthor: (productUid: string) => ['get-posts-same-author', productUid] as const,

  // Dashboard manage post detail
  managePostDetail: (productUid: string) => ['get-detail-manage-post', productUid] as const,

  // Profile detail
  profileDetail: (profileSlug: string) => ['get-detail-profile', profileSlug] as const,
};

export type QueryKey = ReturnType<
  | typeof QueryKeys.categoryPosts
  | typeof QueryKeys.searchCount
  | typeof QueryKeys.profilePosts
  | typeof QueryKeys.postDetail
  | typeof QueryKeys.postsSameAuthor
  | typeof QueryKeys.managePostDetail
  | typeof QueryKeys.profileDetail
>;