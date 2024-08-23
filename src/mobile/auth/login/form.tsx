'use client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from './resolver';
import ic_eyy_off from '@assets/icons/eye-off.svg';
import ic_eyy_show from '@assets/icons/eye-show.svg';
import ic_phone from '@assets/icons/ic-phone.svg';
import ic_password from '@assets/icons/ic_password.svg';
import ic_facebook from '@assets/icons/ic_fb.svg';
import ic_google from '@assets/icons/ic_google.svg';
import ic_qr from '@assets/icons/ic_qr.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useLogin } from '@api/auth';
import {
  IFormPropsLogin,
  IFormResponse,
  ILoginResponse,
} from '../types';

export default function LoginForm({
  onLoginSuccess,
  onLoginError,
}: {
  onLoginSuccess?: (response: ILoginResponse) => void;
  onLoginError?: () => void;
}) {
  const [showPassword, setShowPassword] =
    React.useState(false);
  const { login, isLogin } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: IFormPropsLogin) => {
    login(
      {
        phone: data.phone,
        password: data.password,
      },
      {
        onSuccess: (data: {
          data: IFormResponse<ILoginResponse>;
        }) => {
          if (data.data.status) {
            if (onLoginSuccess) {
              onLoginSuccess(data.data.data);
            }
          } else {
            if (onLoginError) {
              onLoginError();
            }
          }
        },
      },
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          marginBottom: '16px',
        }}
      >
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium"
                style={{
                  color: '#374151',
                }}
              >
                Số điện thoại/ Email
              </label>
              <div className="relative">
                <input
                  {...field}
                  id="phone"
                  type="text"
                  style={{
                    paddingLeft: '36px',
                  }}
                  className={`mt-1 block w-full border py-2 ${
                    errors.phone
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                  placeholder="Nhập số điện thoại/ Email"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    left: '8px',
                  }}
                >
                  <Image
                    src={ic_phone}
                    alt="ic_phone"
                    width={20}
                    height={20}
                  />
                </div>
              </div>

              {errors.phone && (
                <p
                  style={{
                    color: '#EF4444',
                  }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.phone.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="mb-4">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
                style={{
                  color: '#374151',
                }}
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  style={{
                    paddingLeft: '36px',
                  }}
                  {...field}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`mt-1 block w-full border py-2 ${
                    errors.password
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                  placeholder="Nhập mật khẩu"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    left: '8px',
                  }}
                >
                  <Image
                    src={ic_password}
                    alt="ic_password"
                    width={20}
                    height={20}
                  />
                </div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    right: '16px',
                  }}
                  className="absolute top-1/2 flex -translate-y-1/2 items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <Image
                      src={ic_eyy_off}
                      alt="ic_eyy_off"
                      width={16}
                      height={16}
                    />
                  ) : (
                    <Image
                      src={ic_eyy_show}
                      alt="ic_eyy_show"
                      width={16}
                      height={16}
                    />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  style={{
                    color: '#EF4444',
                  }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="mb-4 flex justify-end">
        <Link
          style={{
            color: '#2563EB',
            marginTop: '16px',
          }}
          href="/"
          className="text-sm"
        >
          Quên mật khẩu?
        </Link>
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: '#2563EB',
          color: '#fff',
          marginBottom: '32px',
          marginTop: '32px',
        }}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Đăng nhập
      </button>

      <div className="text-center">
        <span className="pr-1 text-sm">
          {' '}
          Bạn chưa có tài khoản?
        </span>
        <Link
          style={{
            color: '#2563EB',
          }}
          href="/register"
          className="text-sm"
        >
          Đăng ký
        </Link>
      </div>

      <div
        style={{
          marginTop: '32px',
        }}
        className="flex w-full justify-center space-x-4"
      >
        <div className="my-6 flex w-full items-center justify-center">
          <div
            style={{
              borderTop: '1px solid #E5E7EB',
              width: '40%',
            }}
            className="flex-grow border-t border-gray-300"
          ></div>
          <span className="mx-4 w-full px-2 text-center text-sm text-gray-500">
            Hoặc đăng nhập bằng
          </span>
          <div
            style={{
              borderTop: '1px solid #E5E7EB',
              width: '40%',
            }}
            className="flex-grow border-t border-gray-300"
          ></div>
        </div>
      </div>
      <div
        className="flex items-center justify-center gap-4"
        style={{
          gap: '24px',
          marginTop: '32px',
        }}
      >
        <div
          className="flex cursor-pointer items-center justify-center"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#94a3b8 ',
          }}
        >
          <Image
            src={ic_facebook}
            width={32}
            height={32}
            alt="ic_facebook"
          />
        </div>
        <div
          className="flex cursor-pointer items-center justify-center"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#94a3b8 ',
          }}
        >
          <Image
            src={ic_google}
            width={32}
            height={32}
            alt="ic_google"
          />
        </div>
        <div
          className="flex cursor-pointer items-center justify-center"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#94a3b8 ',
          }}
        >
          <Image
            src={ic_qr}
            width={32}
            height={32}
            alt="ic_qr"
          />
        </div>
      </div>
    </form>
  );
}
