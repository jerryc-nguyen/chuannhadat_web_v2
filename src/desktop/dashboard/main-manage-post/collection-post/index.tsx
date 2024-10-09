'use client'

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { useEffect, useState } from "react"
import { Product, productSchema } from "./data/schemas/product-schema"
import ProductApiService from "./apis/product-api"
import { ProductQuery } from "./data/schemas/product-query-schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const defaultValues = {
  business_type: "",
  category_type: "",
  city_id: "",
  district_id: "",
  ward_id: "",
  street_id: "",
  project_id: "",
  price: "",
  area: "",
  floors_count: "",
  directions: "",
  mat_tien: "",
  bedrooms_count: "",
  bathrooms_count: "",
  selected_ids: "",
  furnitures:"",

  sort_by: "",
  sort_direction: "",
  page: 1,
  per_page: 10,
}

export default function TaskDataTable() {
  const [productsList, setProductList] = useState<Product[]>([]);
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues
  });

  const handleFilter = async ( data: ProductQuery ) => {
    try {
        const res = await ProductApiService.Filter(data);
        console.log("handleFilter products list", res);
        setProductList(res.data)
        
    } catch (err) {
        console.error("handleFilter error", err);
    }
  };

  useEffect(() => {
    // form.handleSubmit(handleFilter)();
    const initialValues = form.getValues(); // Get the current form values
    handleFilter(initialValues); 
  }, [])

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <DataTable data={productsList} columns={columns} />
    </div>
  )
}
