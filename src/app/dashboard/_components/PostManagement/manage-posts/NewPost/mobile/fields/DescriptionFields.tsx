import { UseFormReturn } from 'react-hook-form';
import { CardTitle } from '@components/ui/card';
import List from '@components/konsta/List';
import { IPostForm } from '@dashboard/PostManagement/types';
import { InputDescription, InputTitle } from '@dashboard/PostManagement/manage-posts/components/form-components/product-description';

interface DescriptionFieldsProps {
  form: UseFormReturn<IPostForm>;
}

export default function DescriptionFields({ form }: DescriptionFieldsProps) {
  return (
    <>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Nội dung mô tả</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg px-4 py-4">
        <InputTitle form={form} />
        <InputDescription form={form} />
      </List>
    </>
  );
} 
