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
      <CardTitle className="text-base flex items-center gap-2 px-4 pb-3 pt-4">Youtube Video</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <div className="px-4 py-4 space-y-4">
          <InputYoutube form={form} />
        </div>
      </List>

      <CardTitle className="text-base flex items-center gap-2 px-4 pb-3">Hình Ảnh</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <div className="px-4 py-4 space-y-4">
          <UploadImages form={form} />
        </div>
      </List>
    </>
  );
} 
