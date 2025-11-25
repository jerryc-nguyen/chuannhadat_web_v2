'use client';

import { NEWS_TYPE_OPTION, POSTS_TYPE_OPTION } from "@frontend/features/navigation/main-content-navigator/constants";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const enum SearchScopeEnums {
  Profile = 'profile',
  ManagePosts = 'manage_posts',
  Category = 'category',
  News = 'news'
}

export default function useSearchScope() {
  const pathname = usePathname() || '';

  const searchScope = useMemo(() => {
    if (pathname.indexOf('profile/') != -1) {
      return SearchScopeEnums.Profile
    }
    else if (pathname.indexOf('/tin-tuc') != -1) {
      return SearchScopeEnums.News
    } else if (pathname.indexOf('/dashboard/') != -1) {
      return SearchScopeEnums.ManagePosts
    } else {
      return SearchScopeEnums.Category
    }
  }, [pathname])

  const isProfileAgg = useMemo(() => {
    return searchScope == SearchScopeEnums.Profile || searchScope == SearchScopeEnums.ManagePosts
  }, [searchScope])

  const currentContentType = useMemo(() => {
    if (pathname.indexOf('/tin-tuc') != -1) {
      return NEWS_TYPE_OPTION
    } else if (pathname.indexOf('/category/') != -1 || pathname == '/') {
      return POSTS_TYPE_OPTION
    } else {
      return POSTS_TYPE_OPTION
    }
  }, [pathname])

  const defaultProfileSearchParams = useMemo(() => {
    // Only support exact "/profile/<slug>" pattern (no trailing slash)
    const match = pathname.match(/^\/profile\/([^/]+)$/);
    if (match) {
      return { author_slug: match[1] } as Record<string, string>;
    }
    return {} as Record<string, string>;
  }, [pathname])

  return {
    searchScope,
    isProfileAgg,
    currentContentType,
    defaultProfileSearchParams
  }
}
