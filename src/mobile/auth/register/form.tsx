'use client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ic_eyy_off from '@assets/icons/eye-off.svg';
import ic_eyy_show from '@assets/icons/eye-show.svg';
import ic_phone from '@assets/icons/ic-phone.svg';
import ic_password from '@assets/icons/ic_password.svg';
import Image from 'next/image';

import { useRegister } from '@api/auth';
import {
  IFormPropsRegister,
  IFormResponse,
  IRegisterResponse,
} from '../types';
import registerSchema from './resolver';

export default function RegisterForm({
  onRegisterSuccess,
  onRegisterError,
}: {
  onRegisterSuccess?: () => void;
  onRegisterError?: () => void;
}) {
  const [showPassword, setShowPassword] =
    React.useState(false);
  const { register, isRegister } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const onSubmit = (data: IFormPropsRegister) => {
    register(
      {
        phone: data.phone,
        password: data.password,
      },
      {
        onSuccess: (data: {
          data: IFormResponse<IRegisterResponse>;
        }) => {
          if (data.data.status) {
            if (onRegisterSuccess) {
              onRegisterSuccess();
            }
          } else {
            if (onRegisterError) {
              onRegisterError();
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
    <>
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
                    type={
                      showPassword ? 'text' : 'password'
                    }
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

        <div className="mb-4">
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                  style={{ color: '#374151' }}
                >
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <input
                    style={{ paddingLeft: '36px' }}
                    {...field}
                    id="confirmPassword"
                    type={
                      showPassword ? 'text' : 'password'
                    }
                    className={`mt-1 block w-full border py-2 ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: '8px' }}
                  >
                    <Image
                      src={ic_password}
                      alt="ic_password"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p
                    style={{ color: '#EF4444' }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <button
          disabled={isRegister}
          type="submit"
          style={{
            backgroundColor: '#2563EB',
            color: '#fff',
            marginBottom: '32px',
            marginTop: '32px',
          }}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Đăng ký
        </button>
      </form>
    </>
  );
}
