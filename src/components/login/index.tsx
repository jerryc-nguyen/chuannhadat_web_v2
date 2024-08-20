"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import loginSchema from "./resolver";
import ic_eyy_off from "@styles/images/icon/eye-off.svg";
import ic_eyy_show from "@styles/images/icon/eye-show.svg";
import ic_phone from "@styles/images/icon/ic-phone.svg";
import ic_password from "@styles/images/icon/ic_password.svg";
import ic_facebook from "@styles/images/icon/ic_fb.svg";
import ic_google from "@styles/images/icon/ic_google.svg";
import ic_qr from "@styles/images/icon/ic_qr.svg";
import Image from "next/image";
import Link from "next/link";
import { IFormPropsLogin } from "src/common/inteface";
export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: IFormPropsLogin) => {
    console.log(data);
    // Handle login logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
        paddingTop: "32px",
        paddingBottom: "32px",
      }}
      className="max-w-md mx-auto mt-8 p-4"
    >
      <h2
        className="text-center font-bold"
        style={{
          fontSize: "20px",
          marginBottom: "16px",
        }}
      >
        Đăng nhập
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <Controller
            name="emailOrPhone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div>
                <label
                  htmlFor="emailOrPhone"
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
                    id="emailOrPhone"
                    type="text"
                    style={{
                      paddingLeft: "36px",
                    }}
                    className={`mt-1 block w-full  py-2 border ${
                      errors.emailOrPhone ? "border-red-500" : "border-gray-300"
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

                {errors.emailOrPhone && (
                  <p
                    style={{
                      color: "#EF4444",
                    }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.emailOrPhone.message}
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

        <div className="flex justify-end mb-4">
          <Link
            style={{
              color: "#2563EB",
              marginTop: "16px",
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
            backgroundColor: "#2563EB",
            color: "#fff",
            marginBottom: "32px",
            marginTop: "32px",
          }}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Đăng nhập
        </button>

        <div className="text-center">
          <span className="text-sm pr-1"> Bạn chưa có tài khoản?</span>
          <Link
            style={{
              color: "#2563EB",
            }}
            href="/"
            className="text-sm"
          >
            Đăng ký
          </Link>
        </div>

        <div
          style={{
            marginTop: "32px",
          }}
          className="w-full flex justify-center space-x-4"
        >
          <div className="flex items-center justify-center w-full my-6">
            <div
              style={{
                borderTop: "1px solid #E5E7EB",
                width: "20%",
              }}
              className="border-t border-gray-300 flex-grow"
            ></div>
            <span className="mx-4 flex-1 px-2 text-sm text-gray-500">
              Hoặc đăng nhập bằng
            </span>
            <div
              style={{
                borderTop: "1px solid #E5E7EB",
                width: "20%",
              }}
              className="border-t border-gray-300 flex-grow"
            ></div>
          </div>
        </div>
        <div
          className="flex gap-4 items-center justify-center"
          style={{
            gap: "24px",
            marginTop: "32px",
          }}
        >
          <div
            className="flex justify-center items-center cursor-pointer"
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              backgroundColor: "#94a3b8 ",
            }}
          >
            <Image src={ic_facebook} width={32} height={32} alt="ic_facebook" />
          </div>
          <div
            className="flex justify-center items-center cursor-pointer"
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              backgroundColor: "#94a3b8 ",
            }}
          >
            <Image src={ic_google} width={32} height={32} alt="ic_google" />
          </div>
          <div
            className="flex justify-center items-center cursor-pointer"
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              backgroundColor: "#94a3b8 ",
            }}
          >
            <Image src={ic_qr} width={32} height={32} alt="ic_qr" />
          </div>
        </div>
      </form>
    </div>
  );
}
