'use client';
import React from 'react';

import LoginForm from './form';

export default function Login({
  onLoginSuccess,
  onLoginError,
}: {
  onLoginSuccess?: () => void;
  onLoginError?: () => void;
}) {
  return (
    <div
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        paddingTop: '32px',
        paddingBottom: '32px',
      }}
      className="mx-auto mt-8 max-w-md p-4"
    >
      <h2
        className="text-center font-bold"
        style={{
          fontSize: '20px',
          marginBottom: '16px',
        }}
      >
        Đăng nhập
      </h2>
      <LoginForm
        onLoginSuccess={onLoginSuccess}
        onLoginError={onLoginError}
      />
    </div>
  );
}
