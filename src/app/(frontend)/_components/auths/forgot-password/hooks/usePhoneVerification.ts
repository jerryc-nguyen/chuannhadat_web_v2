'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { authApi } from '../../api';
import { PopupType } from '../types';
import { IVerifyPhoneResponseData, IVerifyPhoneResponse } from '../../types';

export const usePhoneVerification = (
  setFocus: (field: 'phoneReset') => void,
  setResetPhone: (phone: string) => void
) => {
  const [account, setAccount] = useState<IVerifyPhoneResponseData | undefined>(undefined);
  const [typePopup, setTypePopup] = useState(PopupType.SendingMessage);
  const [openPopupResetPassword, setOpenPopupResetPassword] = useState(false);

  const { mutate: resetPassword } = useMutation({
    mutationFn: authApi.checkResetPassword,
    onError: (err: AxiosError<A>) => {
      console.error('Có lỗi khi gửi yêu cầu', err);
    },
    onSuccess: (data) => {
      if (data.status) {
        setTypePopup(PopupType.VerifySuccess);
      }
    },
  });

  const { mutate: checkPhone, isPending: isLoadingCheckPhone } = useMutation({
    mutationFn: authApi.verifyPhone,
    onError: (err: AxiosError<A>) => {
      console.error('Có lỗi khi gửi yêu cầu', err);
      toast.error(`Có lỗi khi kiểm tra số điện thoại: ${err.message}`);
      setFocus('phoneReset' as const);
    },
    onSuccess: (response: IVerifyPhoneResponse) => {
      if (response.status) {
        console.log('response', response);
        setTypePopup(PopupType.SendingMessage);
        setOpenPopupResetPassword(true);
        setAccount(response.data);
      } else {
        toast.error(response.message);
        setFocus('phoneReset' as const);
      }
    },
  });

  const handleSubmit = (data: { phoneReset: string }) => {
    checkPhone(data.phoneReset);
    setResetPhone(data.phoneReset);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text.replaceAll('.', ''));
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShowGuide = () => {
    setOpenPopupResetPassword(true);
  };

  return {
    account,
    typePopup,
    openPopupResetPassword,
    isLoadingCheckPhone,
    resetPassword,
    handleSubmit,
    handleCopy,
    handleShowGuide,
    setOpenPopupResetPassword,
  };
};
