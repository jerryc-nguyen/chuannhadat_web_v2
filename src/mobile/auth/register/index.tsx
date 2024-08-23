'use client';
import React from 'react';

import RegisterForm from './form';

export default function Register({
  onRegisterSuccess,
  onRegisterError,
}: {
  onRegisterSuccess?: () => void;
  onRegisterError?: () => void
}) {
  
  return (
    <>
      <div
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          paddingTop: '32px',
          paddingBottom: '32px',
        }}
        className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md"
      >
        <h2
          className="text-center font-bold"
          style={{
            fontSize: '20px',
            marginBottom: '16px',
          }}
        >
          Đăng ký
        </h2>
        <RegisterForm onRegisterSuccess={onRegisterSuccess} onRegisterError={onRegisterError}/>
      </div>
    </>
  );
}
