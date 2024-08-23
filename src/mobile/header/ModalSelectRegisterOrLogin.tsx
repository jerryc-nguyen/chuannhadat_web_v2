'use client';
import Login from '@mobile/auth/login';
import Register from '@mobile/auth/register';
import { ILoginAndRegisterModalType } from '@mobile/auth/states';
import { registerLoginOption } from '@mobile/auth/states/register_login_option';
import useModals from '@mobile/modals/hooks';
import {
  Block,
  Segmented,
  SegmentedButton,
} from 'konsta/react';
import React, { useState } from 'react';

export default function ModalSelectRegisterOrLogin() {
  const [active, setActive] = useState('');
  const { openModal3, closeModal3 } = useModals();
  const handleShowModalLoginAndRegister = (
    value: string,
  ) => {
    setActive(value);
    if (ILoginAndRegisterModalType.LOGIN === value) {
      openModal3({
        name: 'Login',
        content: <Login closeModal3={closeModal3} />,
        title: 'Đăng nhập',
        maxHeightPercent: 0.5,
      });
    } else {
      openModal3({
        name: 'Register',
        content: <Register closeModal3={closeModal3} />,
        title: 'Đăng ký',
        maxHeightPercent: 0.5,
      });
    }
  };
  return (
    <>
      <Block strongIos margin="my-0 mt-2">
        <Segmented strong>
          {registerLoginOption.map((option) => {
            return (
              <SegmentedButton
                strong
                key={option.value}
                active={option.value === active}
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
      </Block>
    </>
  );
}
