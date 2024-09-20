"use client";

import ProductInfoForm from "./components/form-components/product-info-form";
import { ProductConfigForm } from "./components/form-components/product-config-form";
import { businessTypeOptions, categoryTypeOptions } from "./constant";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormSchemaTransactionType,
} from "./components/form-components/form-schema";
import { Form } from "@/components/ui/form";
import ProductDetailInfoForm from "./components/form-components/product-detail-info-form";
import ImageForm from "./components/form-components/image-form";
import { IProductForm } from "./type";
import { Button } from "@components/ui/button";

const NewPostPage: React.FC = () => {
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
    image_ids: ""
  };

  const form = useForm({
    resolver: yupResolver(FormSchemaTransactionType),
    defaultValues,
  });

  const onSubmit = async (data: IProductForm) => {
    try {
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
          <div className="grid items-start gap-6 lg:col-span-2">
            <ImageForm form={form} />
            <ProductInfoForm form={form} />
            <ProductDetailInfoForm form={form} />
          </div>
          <div className="grid items-start gap-6 lg:col-span-1 top-2-safe sticky">
            <ProductConfigForm />
          </div>
        </div>
        <div className="bg-card border bottom-2-safe flex justify-between mt-6 p-3 rounded-lg sticky z-[999999]">
          <Button variant="ghost">Cancel</Button>
          <Button>Đăng tin và thanh toán</Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPostPage;
