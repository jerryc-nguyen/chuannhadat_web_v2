'use client'

import { DataTable } from "./components/data-table"
import { useEffect } from "react"
import useProductActionSetting from "./hooks/product-action-setting"
import ModalPostDetail from "@desktop/post-detail/components/modal-post-detail"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productQueryFromDefaultValues } from "./data/type/product-query"
import { productQueryFormAtom } from "./states"
import { useSetAtom } from "jotai"
import { productQuerySchema } from "./data/schemas/product-query-schema"
import { CollectionPost } from "./constant/use-query-key"
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query"
import ProductApiService from "./apis/product-api"

export default function TaskDataTable() {
  const { handleGetProductActionSettings } = useProductActionSetting();
  const setProductQueryFormAtom = useSetAtom(productQueryFormAtom);

  const form = useForm({
    resolver: zodResolver(productQuerySchema),
    defaultValues: productQueryFromDefaultValues
  });

  useEffect(() => {
    handleGetProductActionSettings();
    setProductQueryFormAtom(form);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useQuery(
    queryOptions({
        queryKey: [CollectionPost, form.getValues()],
        queryFn: () => ProductApiService.Filter(form.getValues()),
        placeholderData: keepPreviousData // don't have 0 rows flash while changing pages/loading next page
    }),
  );

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
      <ModalPostDetail />
      <DataTable />
    </div>
  )
}
