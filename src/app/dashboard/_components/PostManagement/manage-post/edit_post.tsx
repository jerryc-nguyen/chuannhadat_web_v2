'use client';

import { Button } from '@components/ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIsMobile, useSyncQueryToUrl } from '@common/hooks';
import { useBreadcrumb } from '@common/hooks/useBreadcrumb';
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
import ProjectForm from './components/form-components/project-form';

import { PostFormSchema } from './form-schemas';
import { FormMobile } from './mobile/form-create';
import { useManagePostsCache } from '../collection-post/hooks/useManagePostsCache';
import { getQueryClient } from "@common/api/react-query";
import { DASHBOARD_ROUTES } from '@common/router';

const EditPost = ({ productUid }: { productUid: string }) => {
  const { updateRowData } = useManagePostsCache();

  useSyncQueryToUrl({ hide_create_post: true }); // use hide create post button on navbar
  useBreadcrumb([
    {
      link: DASHBOARD_ROUTES.posts.index,
      title: 'Chỉnh sửa tin bán & cho thuê',
      isActive: true,
    }
  ]);

  const isMobile = useIsMobile();
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
    if (!product) {
      toast.error('Tin đăng đã bị xoá');
      return;
    }

    try {
      const params = form.getValues();
      const res = await ProductApiService.Update(product.id, params);

      if (res.status) {
        updateRowData(res.data);
        getQueryClient().invalidateQueries({ queryKey: ['get-detail-manage-post', productUid] })
        toast.success('Cập nhật tin thành công');
      } else {
        // @ts-ignore: ok
        toast.error(res.message || 'Cập nhật tin không thành công');
      }
    } catch (error: A) {
      toast.error(error.message);
      console.log('error', error);
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
                <ProjectForm form={form} />
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
          <Link href={DASHBOARD_ROUTES.posts.index}>
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
