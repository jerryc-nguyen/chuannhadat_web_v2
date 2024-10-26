/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@components/ui/separator";
import { Image } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { IProductForm } from "../../type";
import { Input } from "@components/ui/input";
import { IUploadedImage } from "@components/image-uploader/types";
import ImageUploader from "@components/image-uploader";

interface IImageForm {
  form: UseFormReturn<IProductForm>;
}

const ImageForm: React.FC<IImageForm> = ({ form }) => {

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
          name="youtube_url"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <Input
                {...field}
                className="relative"
                placeholder="Nhập Link Youtube..."
              />
              <FormDescription>
                URL phải có định dạng: https://www.youtube.com/watch?....
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_ids"
          render={({ field }) => {

            const onImagesChanged = (images: IUploadedImage[]) => {
              const imageIds = images.map(img => img.id?.toString()).join(',')
              field.onChange(imageIds)
            }

            return (
              <FormItem className="grid gap-2">
                <ImageUploader uploadedImages={[]} onUploaded={onImagesChanged} />
                <FormMessage />
              </FormItem>
            )
          }}
        />

      </CardContent>
    </Card>
  );
};

export default ImageForm;
