import { yupResolver } from '@hookform/resolvers/yup';
import { useSyncQueryToUrl } from '@common/hooks';
import { useBreadcrumb } from '@common/hooks/useBreadcrumb';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { default as ManageProductApis, default as ProductApiService } from '../../apis/product-api';
import { PostFormSchema } from '../../form-schemas';
import { useManagePostsCache } from '../../ListPosts/hooks/useManagePostsCache';
import { getQueryClient } from "@common/api/react-query";
import { DASHBOARD_ROUTES } from '@common/router';

export const useEditPostForm = (productUid: string) => {
  const { updateRowData } = useManagePostsCache();

  // Setup breadcrumbs and URL sync
  useSyncQueryToUrl({ hide_create_post: true }); // use hide create post button on navbar
  useBreadcrumb([
    {
      link: DASHBOARD_ROUTES.posts.index,
      title: 'Chỉnh sửa tin bán & cho thuê',
      isActive: true,
    }
  ]);

  // Fetch product data
  const { data: product, isSuccess } = useQuery({
    queryKey: ['get-detail-manage-post', productUid],
    queryFn: () => ManageProductApis.getDetail(productUid),
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
    select: (data) => data.data,
  });

  const formData = isSuccess ? product : {};

  console.log('product', product);

  // Form setup
  const form = useForm({
    // @ts-ignore: ok
    resolver: yupResolver(PostFormSchema),
    defaultValues: formData,
    reValidateMode: 'onChange',
  });

  // Submit handler
  const onSubmit = async (product: unknown) => {
    if (!product) {
      toast.error('Tin đăng đã bị xoá');
      return;
    }

    try {
      const params = form.getValues();
      const productData = product as { id: string | number };
      const productId = typeof productData.id === 'string' ? parseInt(productData.id, 10) : productData.id;
      const res = await ProductApiService.Update(productId, params);

      if (res.status) {
        updateRowData(res.data);
        getQueryClient().invalidateQueries({ queryKey: ['get-detail-manage-post', productUid] })
        toast.success('Cập nhật tin thành công');
      } else {
        // @ts-ignore: ok
        toast.error(res.message || 'Cập nhật tin không thành công');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Cập nhật tin không thành công';
      toast.error(errorMessage);
      console.log('error', error);
    }
  };

  return {
    form,
    onSubmit,
    product,
    isSuccess,
  };
};
