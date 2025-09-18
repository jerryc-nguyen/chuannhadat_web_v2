'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../utils/validation';

export const useForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phoneReset: '',
    },
  });

  const { handleSubmit, control, setFocus, reset } = form;

  const handleFormSubmit = (onSubmit: (data: ForgotPasswordFormData) => void) => {
    return handleSubmit((data) => {
      onSubmit(data);
      reset();
    });
  };

  return {
    form,
    handleSubmit: handleFormSubmit,
    control,
    setFocus,
  };
};
