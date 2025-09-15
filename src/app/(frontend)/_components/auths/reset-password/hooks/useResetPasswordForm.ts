'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '../utils/validation';

export const useResetPasswordForm = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, control, setFocus, formState: { errors } } = form;

  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return {
    form,
    handleSubmit,
    control,
    setFocus,
    errors,
    showNewPassword,
    showConfirmPassword,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
  };
};
