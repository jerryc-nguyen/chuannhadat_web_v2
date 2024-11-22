'use client';

import React, { useState } from 'react';
import LoginForm from '@mobile/auth/login/form';
import RegisterForm from '@mobile/auth/register/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

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
type ModalSelectRegisterOrLoginProps = {
  onClose: () => void;
};
export default function ModalSelectRegisterOrLogin({
  onClose,
}: ModalSelectRegisterOrLoginProps) {
  const [activeTab, setActiveTab] = useState('login');
  const handleShowModalLoginAndRegister = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs defaultValue={activeTab}>
      <TabsList className="flex w-full h-11">
        {authOptions.map((option) => {
          return (
            <TabsTrigger
              key={option.value}
              className="flex-1 rounded-md py-2"
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
      <TabsContent value="login">
        <div className="mt-8">
          <LoginForm onClose={onClose} />
        </div>
      </TabsContent>
      <TabsContent value="register">
        <div className="mt-8">
          <RegisterForm onClose={onClose} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
