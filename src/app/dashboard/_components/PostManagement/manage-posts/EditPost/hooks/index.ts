import { yupResolver } from '@hookform/resolvers/yup';
import { useBreadcrumb } from '@common/hooks/useBreadcrumb';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { default as ManageProductApis, default as ProductApiService } from '../../apis/product-api';
import { PostFormSchema } from '../../form-schemas';
import { useManagePostsCache } from '../../ListPostsV2/hooks/useManagePostsCache';
import { getQueryClient } from "@common/api/react-query";
import { getPostManagementBreadcrumb } from '../../helpers';
import { trackError } from '@common/features/track_errors';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '@common/router';
import { useEffect, useRef } from 'react';
import { useAuth } from '@common/auth/AuthContext';

export const useEditPostForm = (productUid: string) => {
  const { updateRowData } = useManagePostsCache();
  const router = useRouter();
  const { currentUser } = useAuth();
  const hasHandledErrorRef = useRef(false);

  // Fetch product data
  const { data: product, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['get-detail-manage-post', productUid],
    queryFn: () => ManageProductApis.getDetail(productUid),
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
    select: (data) => data.data,
  });

  useEffect(() => {
    if (hasHandledErrorRef.current) return;
    const inValidAuthor = currentUser && product && product.user_id && product.user_id != currentUser.id
    if (!isLoading && (isError || (isSuccess && !product)) || inValidAuthor) {
      hasHandledErrorRef.current = true;
      router.push(DASHBOARD_ROUTES.posts.index);
      setTimeout(() => {
        toast.error('Tin đăng không tồn tại');
      }, 1000);
      const message = 'Edit tin đăng không tồn tại';
      trackError(message, 'edit_post', {
        request_data: {
          inValidAuthor: inValidAuthor,
          productUid,
          currentUserId: currentUser?.id,
          productUserId: product?.user_id,
        },
        response_data: {},
        message
      });
    }
  }, [isLoading, isError, isSuccess, product, router, currentUser]);


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
          message: errorMessage
        });
        toast.error(errorMessage);
      }
    } catch (error: A) {
      const errorMessage = error instanceof Error ? error.message : 'Cập nhật tin không thành công - 2';
      toast.error(errorMessage);
      trackError(error, 'update_post', {
        ...(serverResponse && { response_data: serverResponse }),
        request_data: params,
        message: errorMessage
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
