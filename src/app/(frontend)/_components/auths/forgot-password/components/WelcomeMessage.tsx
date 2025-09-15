'use client';
import React from 'react';

const WelcomeMessage: React.FC = () => {
  return (
    <>
      <h1 className="text-2xl font-semibold md:text-3xl xl:text-4xl">Quên mật khẩu ?</h1>
      <p className="mt-4">
        Đừng lo lắng, điều này xảy ra với tất cả chúng ta. Nhập số điện thoại của bạn dưới đây
        để khôi phục mật khẩu của bạn.
      </p>
    </>
  );
};

export default WelcomeMessage;
