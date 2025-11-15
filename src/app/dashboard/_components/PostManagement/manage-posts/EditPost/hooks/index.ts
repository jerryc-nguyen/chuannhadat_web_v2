import { yupResolver } from '@hookform/resolvers/yup';
import { useBreadcrumb } from '@common/hooks/useBreadcrumb';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { default as ManageProductApis, default as ProductApiService } from '../../apis/product-api';
import { PostFormSchema } from '../../form-schemas';
import { useManagePostsCache } from '../../ListPosts/hooks/useManagePostsCache';
import { getQueryClient } from "@common/api/react-query";
import { getPostManagementBreadcrumb } from '../../helpers';
import { trackError } from '@common/features/cnd_errors';
import { useAuth } from '@common/auth/AuthContext';

export const useEditPostForm = (productUid: string) => {
  const { updateRowData } = useManagePostsCache();
  const { currentUser } = useAuth();

  // Fetch product data
  const { data: product, isSuccess } = useQuery({
    queryKey: ['get-detail-manage-post', productUid],
    queryFn: () => ManageProductApis.getDetail(productUid),
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
    select: (data) => data.data,
  });


  const formData = isSuccess ? product : {};

  // Setup breadcrumbs
  useBreadcrumb(getPostManagementBreadcrumb('EDIT_POST'));

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
    const params = form.getValues();
    let serverResponse: A | null = null;
    try {
      const productData = product as { id: string | number };
      const productId = typeof productData.id === 'string' ? parseInt(productData.id, 10) : productData.id;
      const res = await ProductApiService.Update(productId, params);
      serverResponse = res;
      if (res.status) {
        updateRowData(res.data);
        getQueryClient().invalidateQueries({ queryKey: ['get-detail-manage-post', productUid] })
        toast.success('Cập nhật tin thành công');
      } else {

        const errorMessage = res.data?.message || (res as any)?.message || 'Cập nhật tin không thành công - 1';

        trackError(errorMessage, 'update_post', {
          request_data: params,
          response_data: serverResponse,
          message: errorMessage,
          user_id: currentUser?.id
        });
        toast.error(errorMessage);
      }
    } catch (error: A) {
      const errorMessage = error instanceof Error ? error.message : 'Cập nhật tin không thành công - 2';
      toast.error(errorMessage);
      trackError(error, 'update_post', {
        ...(serverResponse && { response_data: serverResponse }),
        request_data: params,
        message: errorMessage,
        user_id: currentUser?.id
      });
    }
  };

  return {
    form,
    onSubmit,
    product,
    isSuccess,
  };
};
