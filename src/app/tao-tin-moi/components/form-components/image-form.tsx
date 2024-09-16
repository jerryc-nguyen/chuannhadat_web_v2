/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@components/ui/separator";
import { Image } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { IProductForm } from "@app/tao-tin-moi/type";
import { FormField, FormItem } from "@/components/ui/form";

import dynamic from "next/dynamic";
import { Input } from "@components/ui/input";
const ImageUploader = dynamic(() => import("./fields/image-uploader"), {
  ssr: false,
});

interface IImageForm {
  form: UseFormReturn<IProductForm>;
}

const ImageForm: React.FC<IImageForm> = ({ form }) => {
  // const image_ids = form.watch("image_ids");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
            <Image /> Hình ảnh, Video
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="grid gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <Input
                {...field}
                className="relative"
                placeholder="Nhập địa chỉ..."
              />
            </FormItem>
          )}
        />
        <ImageUploader form={form}/>
      </CardContent>
    </Card>
  );
};

export default ImageForm;
