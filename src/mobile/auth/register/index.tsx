/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import RegisterForm from './form';

export default function Register() {
  return (
    <>
      <div
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          paddingTop: '32px',
          paddingBottom: '32px',
        }}
        className="mx-auto mt-8 max-w-md rounded-md bg-white p-4"
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
        <RegisterForm onClose={() => { }} handleSetTokenServer={() => { }} />
      </div>
    </>
  );
}
