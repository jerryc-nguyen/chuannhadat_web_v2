'use client';
import { cn } from '@common/utils';
import { Be_Vietnam_Pro } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { LucideEllipsis } from 'lucide-react';

type RelatedNewsLayoutProps = {
  children: React.ReactNode;
};
const vietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '700', '600', '500'],
});
const RelatedNewsLayout: React.FC<RelatedNewsLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const menuPolicy = [
    {
      id: 1,
      link: '/huong-dan-tu-dong-lam-moi',
      title: 'Hướng dẫn tự động làm mới',
    },
    {
      id: 2,
      link: '/gioi-thieu-tin-vip',
      title: 'Giới thiệu tin vip',
    },
    {
      id: 3,
      link: '/bang-gia-dich-vu',
      title: 'Bảng giá dịch vụ',
    },
  ];
  const renderMenuMobile = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <LucideEllipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {menuPolicy.map((menu) => (
            <DropdownMenuItem
              className={cn(
                'cursor-pointer text-nowrap rounded-md px-3 py-1 font-medium transition-all hover:bg-primary_color/10 hover:text-primary_color/80',
                pathname.includes(menu.link) ? 'bg-primary_color/10 text-primary_color/80' : '',
              )}
              key={menu.id}
            >
              <Link href={menu.link}>{menu.title}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  return (
    <section className={cn(vietnam.className, 'mx-auto flex w-full gap-x-3 md:gap-5 2xl:w-4/5')}>
      {children}
      <article className="bg:neutral_00 sticky top-[5rem] z-[5] mt-10 hidden h-fit w-fit rounded-lg border bg-white p-6 shadow-md lg:block">
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
      <div className="z-5 sticky top-[5rem] mt-10 h-fit w-fit bg-white lg:hidden">
        {renderMenuMobile()}
      </div>
    </section>
  );
};

export default RelatedNewsLayout;
