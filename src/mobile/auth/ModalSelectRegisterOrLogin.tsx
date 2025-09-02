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
    <Tabs value={activeTab} onValueChange={handleShowModalLoginAndRegister}>
      <TabsList className="flex w-full h-11">
        {authOptions.map((option) => {
          return (
            <TabsTrigger
              key={option.value}
              className="flex-1 rounded-md py-2"
              value={option.value}
              data-testid={`${option.value}-tab`}
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
          <RegisterForm onClose={onClose} setActiveTab={setActiveTab} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
