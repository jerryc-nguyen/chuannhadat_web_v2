/* eslint-disable jsx-a11y/alt-text */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';
import { FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { Input } from '@components/ui/input';
import { IUploadedImage } from '@components/features/media/image-uploader/types';
import ImageUploader, { convertToUploadedImages } from '@components/features/media/image-uploader';

type ImageFormProps = {
  form: A;
};

// TODO: Remove image form component, use single field

export const ImageForm = ({ form }: ImageFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <Image /> Hình ảnh, Video
        </CardTitle>

      </CardHeader>
      <CardContent className="grid gap-6">
        <InputYoutube form={form} />
        <UploadImages form={form} />
      </CardContent>
    </Card>
  );
};

export default ImageForm;

interface InputYoutubeProps {
  form: A;
}

export function InputYoutube({ form }: InputYoutubeProps) {
  return (
    <FormField
      control={form.control}
      name="youtube_url"
      render={({ field }) => (
        <FormItem className="grid gap-2">
          <Input {...field} className="relative" placeholder="Nhập Link Youtube..." />
          <FormDescription>
            URL phải có định dạng: https://www.youtube.com/watch?....
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface UploadImagesProps {
  form: A;
}

export function UploadImages({ form }: UploadImagesProps) {
  return (
    <FormField
      control={form.control}
      name="image_ids"
      render={({ field }) => {
        const onImagesChanged = (images: IUploadedImage[]) => {
          const imageIds = images.map((img) => img.id?.toString()).join(',');
          field.onChange(imageIds);
        };

        const uploadedImages = convertToUploadedImages(form.getValues('images'));

        return (
          <FormItem className="grid gap-2">
            <ImageUploader uploadedImages={uploadedImages} onUploaded={onImagesChanged} />
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
