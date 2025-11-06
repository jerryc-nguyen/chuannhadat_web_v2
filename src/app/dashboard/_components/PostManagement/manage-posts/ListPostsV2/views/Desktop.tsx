"use client";

import React, { useEffect, useState } from "react";
import DataTableBase from "@/app/dashboard/_components/datagrid/components/DataTableBase";
import FilterBar from "../filters/FilterBar";
import FilterChipsDesktop from "../filters/FilterChipsDesktop";
import { listChipsQuery } from "../constant/list_chips_query";
import { usePostsListContext } from "../context/PostsListProvider";
import useSearchAggs from "@app/(frontend)/_components/features/search/search-aggs/hooks";
import { buildFriendlyParams } from "@app/(frontend)/_components/features/search/filters-v2/helpers/friendlyParamsHelper";
import { FilterState } from "@app/(frontend)/_components/features/search/types";
import { useSyncParamsToState } from "@app/(frontend)/_components/features/search/hooks/useSyncParamsToState";
import { DEFAULT_CHIP_FILTER_PARAMS } from '../constant';

export default function Desktop(): React.ReactElement {
  const ctl = usePostsListContext();
  const { filterState: initFilterState } = useSyncParamsToState();
  const [chipFilterState, setChipFilterState] = useState<FilterState>(initFilterState);
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

      <FilterChipsDesktop
        chipOptions={listChipsQuery}
        onFiltersChanged={onFilterChipsChanged}
        filterState={chipFilterState}
        aggregationData={{
          busCatTypeOptions,
          locationsList,
          projectsOptions,
        }}
        className="bg-none mb-4"
      />

      <DataTableBase table={ctl.table} />
    </div>
  );
}
