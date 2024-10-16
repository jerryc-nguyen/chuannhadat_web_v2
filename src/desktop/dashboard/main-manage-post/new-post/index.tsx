"use client";

import ProductInfoForm from "./components/form-components/product-info-form";
import { businessTypeOptions, categoryTypeOptions } from "./constant";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormSchemaTransactionType,
} from "./components/form-components/form-schema";
import { Form } from "@/components/ui/form";
import ImageForm from "./components/form-components/image-form";
import { IProductForm } from "./type";
import { Button } from "@components/ui/button";
import ProductApiService from "./apis/product-api";
import LocationForm from "./components/form-components/location-form";
import ProductTypeForm from "./components/form-components/product-type";
import ProductDescriptionForm from "./components/form-components/product-description";
import Link from "next/link";

const NewPost: React.FC = () => {
  const defaultValues = { 
    name: "",
    description: "",
    price: 0,
    imgUrl: [],
    category: "",
    //
    business_type: businessTypeOptions[0].value,
    category_type: categoryTypeOptions[0].value,
    title: "",
    area: "",
    phap_ly: "",
    price_in_vnd: "",
    city_id: "",
    district_id: "",
    ward_id: "",
    street_id: "",
    project_id: "",
    full_address: "",
    bedrooms_count: "5",
    bathrooms_count: "3",
    facade: 0,
    entrance: 0,
    floors_count: "",
    entrance_direction: "",
    view_direction: "",
    furniture: "",
    image_ids: "",
    youtube_url: ""
  };

  const form = useForm({
    resolver: yupResolver(FormSchemaTransactionType),
    defaultValues,
    reValidateMode: "onChange"
  });

  const onSubmit = async (data: IProductForm) => {
    try {
      const res = await ProductApiService.Create(data);
      console.log("resssssssss", res);
      
      console.log("data", data);
    } catch (error) {
      console.log("error", error);
    } finally {
      console.log("done");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="items-start gap-6 rounded-lg md:grid lg:grid-cols-3">
          <div className="grid items-start gap-6 lg:col-span-3">
            <ProductTypeForm form={form} />
            <LocationForm form={form} />
            <ProductDescriptionForm form={form} />
            <ProductInfoForm form={form} />
            <ImageForm form={form} />
          </div>
          {/* <div className="grid items-start gap-6 lg:col-span-1 top-2 sticky">
            <ProductConfigForm />
          </div> */}
        </div>
        <div className="bg-card border bottom-2 flex justify-between mt-6 p-3 rounded-lg sticky z-[999999]">
          <Link href={`/dashboard/manage-post/collection-post`}>
            <Button type="button" variant="ghost">Trở lại</Button>
          </Link>
          <Button type="submit">Đăng tin và thanh toán</Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPost;
