'use client';
import React from 'react';
import CommonAlertDialog from '@components/common-dialog';
import ReceivedResetSms from '../ReceivedResetSms';
import Guide from '../Guide';
import { IVerifyPhoneResponseData } from '../../types';
import { PopupType } from '../types';

interface PasswordResetPopupProps {
  isOpen: boolean;
  onClose: () => void;
  typePopup: PopupType;
  account: IVerifyPhoneResponseData | undefined;
  resetPhone: string;
  onCopy: (text: string) => void;
}

const PasswordResetPopup: React.FC<PasswordResetPopupProps> = ({
  isOpen,
  onClose,
  typePopup,
  account,
  resetPhone,
  onCopy,
}) => {
  return (
    <CommonAlertDialog
      isOpen={isOpen}
      handleOpenChange={onClose}
      title={
        typePopup === PopupType.VerifySuccess
          ? 'Tạo lại mật khẩu thành công'
          : 'Hướng dẫn tạo lại mật khẩu'
      }
      description={
        typePopup === PopupType.VerifySuccess ? (
          <ReceivedResetSms resetPhone={resetPhone} />
        ) : (
          account && (
            <Guide
              account={account}
              onCopy={onCopy}
            />
          )
        )
      }
      textButtonRight="Đóng"
    />
  );
};

export default PasswordResetPopup;
