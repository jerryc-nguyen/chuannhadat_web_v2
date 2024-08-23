'use client';

import { registerLoginOption } from '@mobile/auth/states/register_login_option';
import {
  Block,
  Segmented,
  SegmentedButton,
} from 'konsta/react';
import React, { useState } from 'react';
import LoginForm from '@mobile/auth/login/form';
import RegisterForm from '@mobile/auth/register/form';
import { toast } from 'react-toastify';

export default function ModalSelectRegisterOrLogin({ onClose }: {onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('login');
  const handleShowModalLoginAndRegister = (
    value: string,
  ) => {
    setActiveTab(value);
  };
  
  const onLoginSuccess = (response: Record<string, any>) => {
    toast.success(`Xin chào, ${response.full_name || response.phone } bạn đã đăng nhập thành công!`);
    onClose();
  }

  const onLoginError = () => {
    toast.error(
      'Mật khẩu hoặc tài khoản không chính xác',
    );
  }


  return (
    <>
      <Block strongIos margin="my-0 mt-2">
        <Segmented strong>
          {registerLoginOption.map((option) => {
            return (
              <SegmentedButton
                strong
                key={option.value}
                active={option.value === activeTab}
                onClick={() => {
                  handleShowModalLoginAndRegister(
                    option.value,
                  );
                }}
              >
                {option.text}
              </SegmentedButton>
            );
          })}
        </Segmented>
        {activeTab == 'login' && <div className="mt-8"><LoginForm onLoginSuccess={onLoginSuccess} onLoginError={onLoginError}/></div>}
        {activeTab == 'register' && <div className="mt-8"><RegisterForm /></div>}
      </Block>
    </>
  );
}
