import React, { createContext, useContext } from "react";
import { usePostsListController } from "../controller/usePostsListController";
import { desktopColumns, mobileColumns } from "../components/table/columns";
import { FormProvider } from "react-hook-form";
import FormFilterContext, { CounterFetcher } from "@dashboard/../_contexts/FormFilterContext";
import ProductApiService from "../apis/product-api";
import { ProductQuery } from "../schemas/ProductQuerySchema";

const PostsListContext = createContext<any>(null);

type Props = { children: React.ReactNode; isMobile?: boolean; counterFetcher?: CounterFetcher };

export function PostsListProvider({ children, isMobile = false, counterFetcher }: Props) {
  const columns = isMobile ? mobileColumns : desktopColumns;
  const ctl = usePostsListController({ columns });

  // Default counter fetcher using ProductApiService.Filter, returns the total_count
  const defaultCounterFetcher: CounterFetcher = async (filters: ProductQuery) => {
    const query: Record<string, any> = {
      ...filters,
      page: 1,
      per_page: 1,
      aggs_for: 'manage_posts',
    };
    const res = await ProductApiService.Filter(query);
    const payload = res as Record<string, any>;
    const total = payload?.pagination?.total_count ?? 0;
    return Number.isFinite(total) ? total : 0;
  };

  return (
    <PostsListContext.Provider value={ctl}>
      <FormProvider {...ctl.formMethods}>
        <FormFilterContext.Provider
          value={{
            filters: ctl.state.filters,
            setFilters: ctl.actions.setFilters,
            submitFilters: ctl.actions.submitFilters,
            counterFetcher: counterFetcher ?? defaultCounterFetcher,
          }}
        >
          {children}
        </FormFilterContext.Provider>
      </FormProvider>
    </PostsListContext.Provider>
  );
}

export function usePostsListContext() {
  const context = useContext(PostsListContext);
  if (!context) {
    throw new Error("usePostsListContext must be used within a PostsListProvider");
  }
  return context;
}
