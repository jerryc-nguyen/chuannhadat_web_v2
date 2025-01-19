'use client';

import { Button } from '@components/ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIsMobile, useSyncQueryToUrl } from '@hooks';
import { useBreadcrumb } from '@hooks/useBreadcrumb';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { default as ManageProductApis, default as ProductApiService } from './apis/product-api';
import ImageForm from './components/form-components/image-form';
import LocationFormV2 from './components/form-components/location-form-v2';
import ProductDescriptionForm from './components/form-components/product-description';
import ProductInfoForm from './components/form-components/product-info-form';
import ProductTypeForm from './components/form-components/product-type';
import { PostFormSchema } from './form-schemas';
import { FormMobile } from './mobile/form-create';

const EditPost = ({ params }: { params: A }) => {
  useSyncQueryToUrl({ hide_create_post: true }); // use hide create post button on navbar
  useBreadcrumb([
    {
      link: '/manage-post/new-post',
      title: 'Chỉnh sửa tin bán & cho thuê',
      isActive: true,
    }
  ]);

  const isMobile = useIsMobile();
  const productUid = params.slug;

  const { data: product, isSuccess } = useQuery({
    queryKey: ['get-detail-manage-post', productUid],
    queryFn: () => ManageProductApis.getDetail(productUid),
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
    select: (data) => data.data,
  });

  const formData = isSuccess ? product : {};

  const form = useForm({
    // @ts-ignore: ok
    resolver: yupResolver(PostFormSchema),
    defaultValues: formData,
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: A) => {
    console.log('onSubmit', data);
    if (!product) {
      toast.error('Tin đăng đã bị xoá');
      return;
    }

    try {
      const params = form.getValues();
      console.log('params', params);
      const res = await ProductApiService.Update(product.id, params);
      console.log('resssssssss', res);

      if (res.status) {
        toast.success('Cập nhật tin thành công');
      } else {
        // @ts-ignore: ok
        toast.error(res.message || 'Cập nhật tin không thành công');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      console.log('done');
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="items-start gap-6 rounded-lg md:grid lg:grid-cols-3">
          <div className="grid items-start gap-6 lg:col-span-3">
            {isMobile ? (
              <FormMobile />
            ) : (
              <>
                <ProductTypeForm form={form} />
                <LocationFormV2 form={form} />
                <ProductDescriptionForm form={form} />
                <ProductInfoForm form={form} />
                <ImageForm form={form} />
              </>
            )}
          </div>
          {/* <div className="grid items-start gap-6 lg:col-span-1 top-2 sticky">
            <ProductConfigForm />
          </div> */}
        </div>
        <div className="sticky bottom-2 z-[40] mt-6 flex justify-between rounded-lg border bg-card p-3">
          <Link href={`/dashboard/manage-post/collection-post`}>
            <Button type="button" variant="ghost">
              Trở lại
            </Button>
          </Link>
          <Button type="submit">Cập nhật tin</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditPost;
