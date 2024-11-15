import { AuthUtils } from "@common/auth";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const enum SearchScopeEnums {
  Profile = 'profile',
  ManagePosts = 'manage_posts',
  Search = 'search'
}

export default function useSearchScope() {
  const pathname = usePathname();

  const searchScope = useMemo(() => {
    if (pathname.indexOf('profile/') != -1) {
      return SearchScopeEnums.Profile
    } else if (pathname.indexOf('/dashboard/') != -1 && AuthUtils.getCurrentUser()) {
      return SearchScopeEnums.ManagePosts
    } else {
      return SearchScopeEnums.Search
    }
  }, [pathname])

  const isProfileAgg = useMemo(() => {
    return searchScope == SearchScopeEnums.Profile || searchScope == SearchScopeEnums.ManagePosts
  }, [searchScope])


  return {
    searchScope,
    isProfileAgg
  }
}
