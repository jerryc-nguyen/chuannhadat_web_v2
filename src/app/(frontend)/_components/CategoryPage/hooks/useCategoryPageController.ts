"use client";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useHydrateFilterStates } from "@app/(frontend)/_components/features/search/hooks/useHydrateFilterStates";
import { useCleanFilterStates } from "@frontend/features/search/filters-v2/hooks/useCleanFilterStates";
import { useFilterState } from "@frontend/features/search/filters-v2/hooks/useFilterState";
import { useFilterStatePresenter } from "@app/(frontend)/_components/features/search/filters-v2/hooks/useFilterStatePresenter";
import useQueryPostsV2 from "@app/(frontend)/_components/features/search/hooks/useQueryPostsV2";
import { useFilterChipsUI } from "@frontend/features/search/hooks/useFilterChipsUI";
import useSearchAggs from "@frontend/features/search/search-aggs/hooks";
import useLoadMissingAuthors from "../hooks/useLoadMissingAuthors";
import { ConvertFromBreadcrumbListJSONLd } from "@components/desktop/components/breadcrumb";

type CategoryPageControllerOptions = {
  perPage: number;
  listFilterOptions: any;
  includeAgg?: boolean;
  initialFilterState?: Record<string, any>;
  currentContentType?: string;
};

export function useCategoryPageController(options: CategoryPageControllerOptions) {
  const { perPage, listFilterOptions, includeAgg = false, initialFilterState, currentContentType } = options;

  // Keep URL → state sync and cleanup behaviors unified
  useCleanFilterStates();

  // Hydrate atoms from server-provided initial state if available (unconditional call)
  useHydrateFilterStates({ filterState: initialFilterState, currentContentType });

  const searchParams = useSearchParams();
  const currentPage = searchParams?.get("page") ? parseInt(searchParams.get("page") as string) : 1;

  const { filterState } = useFilterState();
  const { friendlyParams } = useFilterStatePresenter(filterState);

  const APIFilterParams = useMemo(() => {
    return {
      ...friendlyParams,
      with_title: true,
      with_users: true,
      page: currentPage,
      per_page: perPage,
    };
  }, [friendlyParams, currentPage, perPage]);

  const { products, data, totalCount } = useQueryPostsV2(APIFilterParams);
  useLoadMissingAuthors(data);

  const { filteredChipOptions } = useFilterChipsUI(listFilterOptions);

  // Call hooks unconditionally to preserve order, conditionally use the data
  const agg = useSearchAggs();

  const breadcrumbsLinkItems = useMemo(() => {
    return ConvertFromBreadcrumbListJSONLd(data?.breadcrumb);
  }, [data?.breadcrumb]);
  const pathname = usePathname();
  const isHomePage = useMemo(() => {
    return pathname === "/";
  }, [pathname]);


  return {
    currentPage,
    APIFilterParams,
    products,
    data,
    totalCount,
    filteredChipOptions,
    aggregationData: includeAgg
      ? {
        busCatTypeOptions: agg.busCatTypeOptions,
        locationsList: agg.locationsList,
      }
      : undefined,
    pagination: data?.pagination,
    breadcrumbsJsonLD: data?.breadcrumb,
    breadcrumbsLinkItems,
    isHomePage
  } as const;
}
