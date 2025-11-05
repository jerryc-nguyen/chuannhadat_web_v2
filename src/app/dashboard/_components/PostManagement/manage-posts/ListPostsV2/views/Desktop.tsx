"use client";

import React, { useEffect } from "react";
import DataTableBase from "@/app/dashboard/_components/datagrid/components/DataTableBase";
import FilterBar from "../filters/FilterBar";
import FilterChipsDesktop from "@frontend/CategoryPage/components/FilterChips";
import { listChipsQuery } from "../constant/list_chips_query";
import { usePostsListContext } from "../context/PostsListProvider";
import useSearchAggs from "@app/(frontend)/_components/features/search/search-aggs/hooks";

export default function Desktop(): React.ReactElement {
  const ctl = usePostsListContext();
  const { aggs } = ctl;
  const {
    updateSearchAggs,
    busCatTypeOptions,
    locationsList,
    projectsOptions } = useSearchAggs();


  useEffect(() => {
    console.log("aggsaggs", aggs);
    updateSearchAggs(aggs);
  }, [aggs, updateSearchAggs]);

  return (
    <div className="w-full flex flex-col h-full">

      <FilterBar />

      <FilterChipsDesktop
        chipOptions={listChipsQuery}
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
