'use client';
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@components/ui/button';

interface SuccessMessageProps {
  onLoginClick: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onLoginClick }) => {
  return (
    <section className="flex min-h-[100dvh] items-center justify-center overflow-x-hidden bg-[#fefdf9]">
      <section className="shadow-dropdown flex h-full w-full flex-col overflow-hidden rounded-xl bg-transparent md:h-fit md:w-4/5 md:flex-row md:bg-white lg:w-2/3">
        <section className="flex flex-col items-center justify-center px-5 py-10 text-center md:w-1/2 md:p-10">
          <div className="mb-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          </div>
          <h1 className="mb-4 text-2xl font-semibold text-green-600 md:text-3xl">
            Mật khẩu đã được đặt lại thành công!
          </h1>
          <p className="mb-6 text-gray-600">
            Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây...
          </p>
          <Button
            onClick={onLoginClick}
            className="bg-primary_color hover:bg-primary_color/80"
          >
            Đăng nhập ngay
          </Button>
        </section>
        <div className="relative flex w-full items-center overflow-x-hidden bg-[url(https://cdn.tailkit.com/media/landing/components-hero.png)] bg-cover bg-right-bottom px-6 py-10 dark:bg-center md:w-1/2 md:px-10 lg:p-16">
          <div className="absolute inset-0 bg-green-950/85 backdrop-blur-sm"></div>
          <div className="relative text-center md:text-left">
            <p className="mb-2 font-semibold leading-relaxed text-white">
              &quot;Bảo mật tài khoản là ưu tiên hàng đầu của chúng tôi&quot;
            </p>
            <p className="text-sm text-gray-200">Chuẩn Nhà Đất Team</p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default SuccessMessage;
