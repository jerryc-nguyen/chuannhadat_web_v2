'use client';
import React from 'react';
import { IVerifyPhoneResponseData } from '../../types';

interface AccountGreetingProps {
  account: IVerifyPhoneResponseData | undefined;
  onShowGuide: () => void;
}

const AccountGreeting: React.FC<AccountGreetingProps> = ({ account, onShowGuide }) => {
  if (!account) return null;

  return (
    <p className="mt-4">
      Xin chào {account?.name}, vui lòng xem{' '}
      <b
        onClick={onShowGuide}
        className="font-semibold text-primary_color hover:cursor-pointer hover:underline"
      >
        hướng dẫn
      </b>{' '}
      để reset mật khẩu
    </p>
  );
};

export default AccountGreeting;
