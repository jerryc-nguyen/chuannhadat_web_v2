'use client'

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { useEffect } from "react"
import useProductActionSetting from "./hooks/product-action-setting"
import ModalPostDetail from "@desktop/post-detail/components/modal-post-detail"
import useProductsList from "./hooks/product-list"

export default function TaskDataTable() {
  const { productsList, handleFilterProduct, productQueryForm } = useProductsList();
  const { handleGetProductActionSettings } = useProductActionSetting();
  
  useEffect(() => {
    handleFilterProduct(productQueryForm.getValues());
    handleGetProductActionSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
      <ModalPostDetail />
      <DataTable data={productsList} columns={columns} />
    </div>
  )
}
