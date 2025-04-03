import { AuthUtils } from "@common/auth";
import { NEWS_TYPE_OPTION, POSTS_TYPE_OPTION } from "@components/main-content-navigator/constants";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const enum SearchScopeEnums {
  Profile = 'profile',
  ManagePosts = 'manage_posts',
  Search = 'search',
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
    } else if (pathname.indexOf('/dashboard/') != -1 && AuthUtils.getCurrentUser()) {
      return SearchScopeEnums.ManagePosts
    } else {
      return SearchScopeEnums.Search
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

  return {
    searchScope,
    isProfileAgg,
    currentContentType
  }
}
