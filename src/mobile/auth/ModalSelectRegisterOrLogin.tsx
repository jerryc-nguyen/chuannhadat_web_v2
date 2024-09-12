'use client';

import React, { useState } from 'react';
import LoginForm from '@mobile/auth/login/form';
import RegisterForm from '@mobile/auth/register/form';
import { toast } from 'react-toastify';
import useAuth from './hooks/useAuth';
import { ILoginResponse } from './types';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';

const authOptions = [
  {
    text: 'Đăng nhập',
    value: 'login',
  },
  {
    text: 'Đăng ký',
    value: 'register',
  },
];

export default function ModalSelectRegisterOrLogin({ onClose }: { onClose: () => void }) {
  const { setCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const handleShowModalLoginAndRegister = (value: string) => {
    setActiveTab(value);
  };

  const onLoginSuccess = (response: ILoginResponse) => {
    toast.success(`Xin chào, ${response.full_name || response.phone} bạn đã đăng nhập thành công!`);
    setCurrentUser(response);
    onClose();
  };

  const onLoginError = () => {
    toast.error('Mật khẩu hoặc tài khoản không chính xác');
  };

  return (
    <>
      <div className="mt-2 bg-white p-4">
        <Tabs defaultValue={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            {authOptions.map((option) => {
              return (
                <TabsTrigger
                  key={option.value}
                  value={option.value}
                  onClick={() => {
                    handleShowModalLoginAndRegister(option.value);
                  }}
                >
                  {option.text}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        {activeTab == 'login' && (
          <div className="mt-8">
            <LoginForm onLoginSuccess={onLoginSuccess} onLoginError={onLoginError} />
          </div>
        )}
        {activeTab == 'register' && (
          <div className="mt-8">
            <RegisterForm />
          </div>
        )}
      </div>
    </>
  );
}
