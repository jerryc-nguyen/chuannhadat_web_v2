"use client";

import ProductInfoForm from "./components/form-components/product-info-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Form } from "@/components/ui/form";
import ImageForm from "./components/form-components/image-form";
import { Button } from "@components/ui/button";
import ProductApiService from "./apis/product-api";
import ProductTypeForm from "./components/form-components/product-type";
import ProductDescriptionForm from "./components/form-components/product-description";
import Link from "next/link";
import LocationFormV2 from "./components/form-components/location-form-v2";
import { toast } from 'sonner';
import { PostFormSchema } from "./form-schemas";
import { IProductForm } from "../types";
import ManageProductApis from "./apis/product-api";
import { useQuery } from "@tanstack/react-query";


const defaultValues: IProductForm = {
  description: "",
  title: "test",
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
  facade: "",
  entrance: "",
  floors_count: "",
  entrance_direction: "",
  view_direction: "",
  furniture: "",
  image_ids: "",
  youtube_url: ""
};

const EditPost = ({ params }: { params: { slug: string } }) => {
  const productUid = params.slug

  const { data: product, isSuccess } = useQuery({
    queryKey: ['get-detail-manage-post', productUid],
    queryFn: () => ManageProductApis.getDetail(productUid),
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
    select: (data) => data.data,
  });

  const formData = isSuccess ? product : {}

  console.log('formData', formData);
  console.log('product', product);
  const form = useForm({
    // @ts-ignore: ok
    resolver: yupResolver(PostFormSchema),
    defaultValues: formData,
    reValidateMode: "onChange"
  });

  const onSubmit = async () => {
    try {
      const params = form.getValues();
      console.log('params', params);
      // const res = await ProductApiService.Create(params);
      // console.log("resssssssss", res);

      // if (res.status) {
      //   toast.success('Đăng tin thành công');
      //   setTimeout(() => {
      //     window.location.href = '/dashboard/manage-post/collection-post'
      //   }, 1500)

      // } else {
      //   // @ts-ignore: ok
      //   toast.error(res.message || 'Đăng tin không thành công');
      // }
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
            <ImageForm form={form} />
            <ProductDescriptionForm form={form} />

            <ProductTypeForm form={form} />
            <LocationFormV2 form={form} />

            <ProductInfoForm form={form} />

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

export default EditPost;
