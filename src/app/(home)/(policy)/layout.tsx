'use client';
import { cn } from '@common/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type PolicyLayoutProps = {
  children: React.ReactNode;
};

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const menuPolicy = [
    {
      id: 1,
      link: '/quy-dinh-dang-tin',
      title: 'Quy định đăng tin',
    },
    {
      id: 2,
      link: '/chinh-sach-va-quy-dinh',
      title: 'Chính sách và quy định',
    },
    {
      id: 3,
      link: '/chinh-sach-bao-mat',
      title: 'Chính Sách Bảo Mật Thông Tin',
    },
    {
      id: 4,
      link: '/chinh-sach-khieu-nai',
      title: 'Chính Sách Khiếu Nại',
    },
  ];
  return (
    <section className="mx-auto flex w-full gap-x-10 md:w-4/5">
      {children}
      <article className="bg:neutral_00 sticky top-28 z-[5] mt-5 h-fit w-fit rounded-lg border p-6 shadow-md">
        <ul className="flex flex-col gap-y-2">
          {menuPolicy.map((menu) => (
            <li
              key={menu.id}
              className={cn(
                'cursor-pointer text-nowrap rounded-md px-3 py-1 font-medium transition-all hover:bg-primary_color/10 hover:text-primary_color/80',
                pathname.includes(menu.link) ? 'bg-primary_color/10 text-primary_color/80' : '',
              )}
            >
              <Link href={menu.link}>{menu.title}</Link>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};

export default PolicyLayout;
