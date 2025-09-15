'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { authApi } from '../../api';
import { ResetPasswordFormData } from '../utils/validation';

export const usePasswordReset = (token: string | null, setFocus?: (field: 'newPassword' | 'confirmPassword') => void) => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: authApi.updateNewPassword,
    onError: (err: AxiosError) => {
      console.error('Lỗi khi đặt lại mật khẩu:', err);
      toast.error(`Đặt lại mật khẩu thất bại: ${err.message}`);
      setFocus?.('newPassword');
    },
    onSuccess: (data) => {
      if (data.status) {
        setIsSuccess(true);
        toast.success('Mật khẩu đã được đặt lại thành công!');
        setTimeout(() => {
          router.push('/users/sign-in');
        }, 3000);
      } else {
        toast.error(data.message);
        setFocus?.('newPassword');
      }
    },
  });

  const handleSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Token không hợp lệ');
      return;
    }

    resetPassword({
      security_token: token,
      password: data.newPassword,
      password_confirmation: data.confirmPassword,
    });
  };

  const handleLoginClick = () => {
    router.push('/users/sign-in');
  };

  // Handle invalid token redirect
  const handleInvalidToken = () => {
    if (!token) {
      toast.error('Token không hợp lệ hoặc đã hết hạn');
      router.push('/users/forgot-password');
    }
  };

  return {
    isSuccess,
    isPending,
    handleSubmit,
    handleLoginClick,
    handleInvalidToken,
  };
};
