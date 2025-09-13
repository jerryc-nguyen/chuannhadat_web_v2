'use client';
import Logo from '@components/logo';
import Link from 'next/link';
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import RegisterForm from '@frontend/features/auth/mobile/register/form';
import { useRouter } from 'next/navigation';

type SignUpPageProps = object;

const SignUpPage: React.FC<SignUpPageProps> = () => {
  const router = useRouter();
  return (
    <section className="flex min-h-[100dvh] items-center justify-center overflow-x-hidden bg-[#fefdf9]">
      <section className="shadow-dropdown flex h-full w-full flex-col overflow-hidden rounded-xl bg-transparent md:h-fit md:w-4/5 md:flex-row md:bg-white lg:w-2/3">
        <section className="px-5 py-10 md:w-1/2 md:p-10">
          <Logo isAlwaysShow />
          <Link href="/" className="my-4 flex items-center gap-x-2 font-medium hover:underline">
            <ChevronLeft />
            Trang chủ
          </Link>
          <h1 className="mb-8 text-2xl font-semibold md:text-3xl xl:text-4xl">Đăng ký tài khoản</h1>
          <RegisterForm
            onClose={() => {
              router.push('/');
            }}
          />
        </section>
        <div className="relative flex w-full items-center overflow-x-hidden bg-[url(https://cdn.tailkit.com/media/landing/components-hero.png)] bg-cover bg-right-bottom px-6 py-10 dark:bg-center md:w-1/2 md:px-10 lg:p-16">
          <div className="absolute inset-0 bg-blue-950/85 backdrop-blur-sm dark:bg-gray-800/95"></div>
          <div className="relative text-center md:text-left">
            <p className="mb-2 font-semibold leading-relaxed text-white">
              &quot;Chuẩn nhà đất - Cầu nối tin cậy giúp bạn dễ dàng tìm kiếm, đăng tin và biến ước
              mơ an cư lạc nghiệp thành hiện thực!&quot;
            </p>
            <p className="text-sm text-gray-200">Nhan Nguyen, Lead developer</p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default SignUpPage;
