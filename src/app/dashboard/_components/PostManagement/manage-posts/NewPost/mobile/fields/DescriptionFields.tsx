import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardTitle } from '@components/ui/card';
import { IPostForm } from '@dashboard/PostManagement/types';
import { InputDescription, InputTitle } from '@dashboard/PostManagement/manage-posts/components/form-components/product-description';

interface DescriptionFieldsProps {
  form: UseFormReturn<IPostForm>;
}

export default function DescriptionFields({ form }: DescriptionFieldsProps) {
  return (
    <>
      <CardTitle className="text-base flex items-center gap-2 px-4 pb-3 pt-4">
        Nội dung mô tả
      </CardTitle>
      <Card className="w-full">
        <CardContent className="space-y-4 px-4 py-4">
          <InputTitle form={form} />
          <InputDescription form={form} />
        </CardContent>
      </Card>
    </>
  );
} 
