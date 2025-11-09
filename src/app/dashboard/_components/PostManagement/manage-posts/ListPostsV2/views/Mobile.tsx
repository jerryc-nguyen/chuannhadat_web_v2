"use client";

import React, { useEffect, useState } from "react";
import FilterBar from "../filters/FilterBar/mobile";
import { listChipsQuery } from "../constant/list_chips_query";
import { usePostsListContext } from "../context/PostsListProvider";
import useSearchAggs from "@app/(frontend)/_components/features/search/search-aggs/hooks";
import { buildFriendlyParams } from "@app/(frontend)/_components/features/search/filters-v2/helpers/friendlyParamsHelper";
import { FilterState } from "@app/(frontend)/_components/features/search/types";
import { useSyncParamsToState } from "@app/(frontend)/_components/features/search/hooks/useSyncParamsToState";
import { DEFAULT_CHIP_FILTER_PARAMS } from '../constant';
import FilterChipsMobile from "@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/filters/FilterChipsMobile";
import DataTableBaseMobile from "@app/dashboard/_components/datagrid/components/DataTableBaseMobile";

export default function Mobile(): React.ReactElement {
  const ctl = usePostsListContext();
  const { filterState: initFilterState } = useSyncParamsToState();
  const [, setChipFilterState] = useState<FilterState>(initFilterState);
  const { aggs } = ctl;
  const {
    updateSearchAggs,
    busCatTypeOptions,
    locationsList,
    projectsOptions } = useSearchAggs();

  const onFilterChipsChanged = (newFilterState: Record<string, any>) => {
    console.log('newFilterState', newFilterState);
    setChipFilterState(newFilterState);
    const queryParams = buildFriendlyParams(newFilterState);

    // Update filter form with new params
    ctl.actions.setFilters({ ...DEFAULT_CHIP_FILTER_PARAMS, ...queryParams });

    // Trigger search with updated filters
    ctl.actions.submitFilters();
  };

  useEffect(() => {
    updateSearchAggs(aggs);
  }, [aggs, updateSearchAggs]);

  return (
    <div className="w-full flex flex-col h-full">
      <FilterBar />

      <FilterChipsMobile
        chipOptions={listChipsQuery}
        onFiltersChanged={onFilterChipsChanged}
        aggregationData={{
          busCatTypeOptions,
          locationsList,
          projectsOptions,
        }}
      />

      <DataTableBaseMobile table={ctl.table} resourceName="bài đăng" />
    </div>
  );
}
