import { UseFormReturn } from 'react-hook-form';
import { CardTitle } from '@components/ui/card';
import List from '@components/konsta/List';
import { IPostForm } from '@dashboard/PostManagement/types';
import { InputYoutube, UploadImages } from '@dashboard/PostManagement/manage-posts/components/form-components/image-form';

interface MediaFieldsProps {
  form: UseFormReturn<IPostForm>;
}

export default function MediaFields({ form }: MediaFieldsProps) {
  return (
    <>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Hình ảnh, Video</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg px-4 pt-4">
        <InputYoutube form={form} />
        <UploadImages form={form} />
      </List>
    </>
  );
} 
