import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IPostForm } from '../../../types';
import ProductApiService from '../../apis/product-api';
import { PostFormSchema } from '../../form-schemas';
import { useBreadcrumb } from '@common/hooks/useBreadcrumb';
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@common/auth/AuthContext';
import { DASHBOARD_ROUTES } from '@common/router';
import { businessTypeOptions, categoryTypeOptions } from '../../constants';
import { getPostManagementBreadcrumb } from '../../helpers';

export type CreateSourceType = 'desktop' | 'mobile_web';

const defaultValues: IPostForm = {
  description: '',
  business_type: businessTypeOptions[0].value ?? '',
  category_type: categoryTypeOptions[0].value ?? '',
  title: '',
  area: '',
  phap_ly: '',
  price_in_vnd: '',
  city_id: '',
  district_id: '',
  ward_id: undefined,
  street_id: undefined,
  project_id: '',
  full_address: '',
  bedrooms_count: '2',
  bathrooms_count: '2',
  facade: '',
  entrance: '',
  floors_count: '',
  direction: '',
  furniture: '',
  image_ids: '',
  youtube_url: '',
} as const;

export const useNewPostForm = (createSource: CreateSourceType) => {
  const { currentUser } = useAuth();
  const alertShownRef = useRef(false);

  // Setup breadcrumbs
  useBreadcrumb(getPostManagementBreadcrumb('NEW_POST'));

  // Form setup
  const form = useForm<IPostForm>({
    // @ts-expect-error: Type mismatch between IPostForm and schema types
    resolver: yupResolver(PostFormSchema),
    defaultValues,
    reValidateMode: 'onChange',
  });

  // Submit handler
  const onSubmit = async () => {
    try {
      const params = form.getValues();
      params.user_agent = window.navigator.userAgent;
      params.create_source = createSource;

      const res = await ProductApiService.Create(params);

      if (res.status) {
        toast.success('Đăng tin thành công');
        setTimeout(() => {
          window.location.href = DASHBOARD_ROUTES.posts.index;
        }, 1500);
      } else {
        // @ts-ignore: ok
        toast.error(res.message || 'Đăng tin không thành công');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng tin không thành công';
      toast.error(errorMessage);
      // console.log('error', error);
    }
  };

  // User info validation
  const requireUpdateUserInfo = useCallback(() => {
    if (currentUser && (!currentUser.full_name || !currentUser.phone) && !alertShownRef.current) {
      alertShownRef.current = true;
      alert('Bạn phải cập nhật Tên và SĐT liên lạc trước khi đăng tin');
      window.location.href = '/dashboard/account-settings';
    }
  }, [currentUser]);

  // Effect for user info validation
  useEffect(() => {
    if (currentUser) {
      requireUpdateUserInfo();
    }
  }, [currentUser, requireUpdateUserInfo]);

  return {
    form,
    onSubmit,
    defaultValues,
  };
};
