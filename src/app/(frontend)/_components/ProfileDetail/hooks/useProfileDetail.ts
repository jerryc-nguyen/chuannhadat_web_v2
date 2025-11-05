'use client';

import { useEffect, useMemo } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { filterChipOptionsByAggregations } from '@common/filterHelpers';
import useMainContentNavigator from '@frontend/features/navigation/main-content-navigator/hooks';
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';
import { useSyncParamsToState } from '@frontend/features/search/hooks/useSyncParamsToState';
import { useFilterState } from '@frontend/features/search/filters-v2/hooks/useFilterState';
import { useFilterStatePresenter } from '@frontend/features/search/filters-v2/hooks/useFilterStatePresenter';
import { searchApiV2 } from '@app/(frontend)/_components/features/search/api/searchApi';
import { profilesApi } from '../api/profiles';
import { FilterChipOption } from '@common/types';

interface UseProfileDetailProps {
  profileSlug: string;
  filterChipsList: FilterChipOption[];
}

interface UseProfileDetailReturn {
  // Profile data
  profileData: any;
  isProfileLoading: boolean;

  // Search and pagination
  currentPage: number;
  searchParams: URLSearchParams | null;

  // Filter state
  filterState: any;
  onFieldChanged?: (event: any) => void;
  onClearFilter?: (fieldName: any) => void;

  // API and data
  APIFilterParams: any;
  filterParams: any;
  products: any[];
  pagination: any;
  aggreations: any;

  // Processed data
  filteredChipOptions: FilterChipOption[];

  // Search aggregations
  searchAggs: {
    updateSearchAggs: (aggs: any) => void;
    setIsUseAggOptions: (value: boolean) => void;
    busCatTypeOptions: any;
    locationsList: any;
    projectsOptions: any;
  };
}

export const useProfileDetail = ({
  profileSlug,
  filterChipsList
}: UseProfileDetailProps): UseProfileDetailReturn => {
  // Sync params to state
  useSyncParamsToState();

  // URL and search params
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get('page') ? parseInt(searchParams.get('page') as string) : 1;

  // Navigation
  const { resetLocations } = useMainContentNavigator();

  // Search aggregations
  const searchAggs = useSearchAggs();
  const {
    updateSearchAggs,
    setIsUseAggOptions,
    busCatTypeOptions,
    locationsList,
    projectsOptions
  } = searchAggs;

  // Reset locations when the component mounts
  useEffect(() => {
    resetLocations();
  }, [resetLocations]);

  // Profile data fetching
  const {
    data: profileData,
    isLoading: isProfileLoading
  } = useQuery({
    queryKey: ['get-detail-profile', profileSlug],
    queryFn: () => profilesApi.getProfileSlug(profileSlug),
    select: (data) => data.data,
  });

  // Filter state management
  const filterStateHook = useFilterState();
  const { filterState } = filterStateHook;
  const { friendlyParams } = useFilterStatePresenter(filterState);

  // API filter params construction
  const APIFilterParams = useMemo(() => {
    return {
      ...friendlyParams,
      page: currentPage,
      per_page: 9, // ✅ Load 9 products initially for better performance
      author_slug: profileSlug,
      aggs_for: 'profile',
    };
  }, [friendlyParams, currentPage, profileSlug]);

  // For mobile compatibility (filterParams is used in mobile)
  const filterParams = APIFilterParams;

  // Products data fetching
  const {
    data: { data: products, pagination, aggs: aggreations },
  } = useSuspenseQuery({
    queryKey: ['profile-post', { filterParams: APIFilterParams, profileSlug }, currentPage],
    queryFn: () => searchApiV2(APIFilterParams),
  });

  // Update search aggregations when data changes
  useEffect(() => {
    if (aggreations) {
      updateSearchAggs(aggreations);
      setIsUseAggOptions(true);
    }
  }, [aggreations, setIsUseAggOptions, updateSearchAggs]);

  // Filter chip options processing
  const filteredChipOptions = useMemo(() => {
    return filterChipOptionsByAggregations(filterChipsList, aggreations);
  }, [filterChipsList, aggreations]);

  return {
    // Profile data
    profileData,
    isProfileLoading,

    // Search and pagination
    currentPage,
    searchParams,

    // Filter state
    filterState,
    onFieldChanged: filterStateHook.onFieldChanged,
    onClearFilter: filterStateHook.onClearFilter,

    // API and data
    APIFilterParams,
    filterParams,
    products,
    pagination,
    aggreations,

    // Processed data
    filteredChipOptions,

    // Search aggregations
    searchAggs: {
      updateSearchAggs,
      setIsUseAggOptions,
      busCatTypeOptions,
      locationsList,
      projectsOptions,
    },
  };
};
