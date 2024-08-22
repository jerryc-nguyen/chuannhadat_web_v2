"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ic_eyy_off from "@styles/images/icon/eye-off.svg";
import ic_eyy_show from "@styles/images/icon/eye-show.svg";
import ic_phone from "@styles/images/icon/ic-phone.svg";
import ic_password from "@styles/images/icon/ic_password.svg";
import Image from "next/image";

import { useRouter } from "next/navigation";

import { useRegister } from "@api/auth";
import {
  IFormPropsRegister,
  IFormResponse,
  IRegisterResponse,
} from "../states";
import registerSchema from "./resolver";

export default function Register() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, isRegister } = useRegister();
  const router = useRouter();
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
        onSuccess: (data: { data: IFormResponse<IRegisterResponse> }) => {
          if (data.data.status) {
            router.push("/login");
          }
        },
      }
    );
  };
  console.log("isRegister", isRegister);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="relative h-screen w-screen">
      <div
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
          paddingTop: "32px",
          paddingBottom: "32px",
        }}
        className="max-w-md mx-auto mt-8 p-4 absolute inset-x-0 top-1/2 -translate-y-1/2 bg-white rounded-md"
      >
        <h2
          className="text-center font-bold"
          style={{
            fontSize: "20px",
            marginBottom: "16px",
          }}
        >
          Đăng ký
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              marginBottom: "16px",
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
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: "#374151",
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
                        paddingLeft: "36px",
                      }}
                      className={`mt-1 block w-full  py-2 border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Nhập số điện thoại/ Email"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        left: "8px",
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
                        color: "#EF4444",
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
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: "#374151",
                    }}
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      style={{
                        paddingLeft: "36px",
                      }}
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`mt-1 block w-full py-2 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Nhập mật khẩu"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        left: "8px",
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
                        right: "16px",
                      }}
                      className="absolute top-1/2 -translate-y-1/2 flex items-center text-sm leading-5"
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
                        color: "#EF4444",
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
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#374151" }}
                  >
                    Nhập lại mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      style={{ paddingLeft: "36px" }}
                      {...field}
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      className={`mt-1 block w-full py-2 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Nhập lại mật khẩu"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{ left: "8px" }}
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
                      style={{ color: "#EF4444" }}
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
              backgroundColor: "#2563EB",
              color: "#fff",
              marginBottom: "32px",
              marginTop: "32px",
            }}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}
