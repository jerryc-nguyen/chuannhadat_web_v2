import Logo from '@components/logo';
import { HiPhone } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import faceBookIcon from '@assets/icons/Facebook.svg';
import zaloIcon from '@assets/icons/icons8-zalo.svg';
import { HiMail } from 'react-icons/hi';
import { FaTiktok } from 'react-icons/fa';
import { Be_Vietnam_Pro } from 'next/font/google';
import { cn } from '@common/utils';

type FooterProps = object;
const listMenuFooter = [
  {
    key: 1,
    title: 'Về chuẩn nhà đất',
    menu: [
      {
        key: 1,
        value: 'Giới thiệu',
        link: '/gioi-thieu',
      },
      {
        key: 2,
        value: 'Quy định đăng tin',
        link: '/quy-dinh-dang-tin',
      },
      {
        key: 3,
        value: 'Hướng dẫn tự động làm mới',
        link: 'huong-dan-tu-dong-lam-moi',
      },
      {
        key: 4,
        value: 'Giới thiệu các loại tin VIP',
        link: 'gioi-thieu-tin-vip',
      },
      {
        key: 5,
        value: 'Bảng giá dịch vụ',
        link: '/bang-gia-dich-vu',
      },
    ],
  },
  {
    key: 2,
    title: 'Menu chính',
    menu: [
      {
        key: 1,
        value: 'Đăng ký',
        link: '/sign-up',
      },
      {
        key: 2,
        value: 'Đăng nhập',
        link: '/sign-in',
      },
      {
        key: 3,
        value: 'Đăng tin mới',
        link: '/dang-tin-moi',
      },
    ],
  },
  {
    key: 3,
    title: 'Chính sách',
    menu: [
      {
        key: 1,
        value: 'Chính sách bảo mật',
        link: '/chinh-sach-bao-mat',
      },
      {
        key: 2,
        value: 'Chính sách khiếu nại',
        link: '/chinh-sach-khieu-nai',
      },
      {
        key: 3,
        value: 'Chính sách và quy định',
        link: '/chinh-sach-va-quy-dinh',
      },
    ],
  },
];
const listMenuIcon = [
  {
    key: 'icon-facebook',
    link: 'https://www.facebook.com/chuannhadat',
    icon: <Image src={faceBookIcon} alt="facebook-icon" width={20} height={20} />,
  },
  {
    key: 'icon-zalo',
    link: 'https://zalo.me/0966662192',
    icon: <Image src={zaloIcon} alt="zalo-icon" width={20} height={20} />,
  },
  {
    key: 'icon-tiktok',
    link: 'https://www.facebook.com/chuannhadat',
    icon: <FaTiktok className="text-base" />,
  },
];
const vietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '700', '600', '500'],
});

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer
      className={cn(
        'relative overflow-hidden bg-[#030712] px-5 text-white shadow-md md:px-10',
        vietnam.className,
      )}
    >
      <section className="relative flex flex-col justify-between pb-10 pt-12 md:flex-row md:gap-x-6 lg:gap-x-10">
        <div className="relative z-[1] md:max-w-[400px]">
          <Logo className="justify-center md:justify-start" isAlwaysShow />
          <div className="my-4 flex flex-col gap-y-1 text-center text-sm text-secondary md:text-start">
            <p>Trang chuyên đăng tin bất động sản miễn phí.</p>
            <p>
              Nếu bạn muốn góp ý, phản ánh vấn đề, yêu cầu xoá tin, vui lòng liên hệ với chúng tôi
              qua thông tin bên dưới
            </p>
          </div>
          <div className="flex flex-wrap justify-between gap-y-4 border-t border-[#3E4550] pt-4">
            <div className="flex items-center gap-x-2 text-nowrap">
              <HiPhone className="text-xl" />
              <span> 0966662192 ( Linh )</span>
            </div>
            <div className="flex items-center gap-x-2 text-nowrap">
              <HiMail className="text-xl" />
              <span>Chuannhadat@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="relative z-[1] mt-6 flex w-full flex-col justify-between gap-y-6 sm:flex-row md:mt-0 md:w-fit md:gap-x-6 lg:gap-x-10">
          {listMenuFooter.map((menuPart) => (
            <section key={menuPart.key}>
              <h3 className="text-nowrap pb-2 text-xl font-bold text-white">{menuPart.title}</h3>
              <ul>
                {menuPart.menu.map((menuItem) => (
                  <li
                    className="text-nowrap text-secondary transition-all hover:text-white hover:underline"
                    key={menuItem.key}
                  >
                    <Link href={menuItem.link}>{menuItem.value}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
      <section className="relative z-[1] flex flex-col-reverse items-center justify-between gap-y-2 border-t border-[#3E4550] py-6 text-white md:flex-row">
        <span className="text-center sm:text-start">
          Copyright © ChuanNhaDat - 2024, All rights reserved.
        </span>
        <div className="flex gap-x-2">
          {listMenuIcon.map((menuItem) => (
            <div
              key={menuItem.key}
              className="flex h-10 w-10 items-center justify-center rounded-full border hover:cursor-pointer hover:bg-primary_color"
            >
              <Link target="_blank" href={menuItem.link}>
                {menuItem.icon}
              </Link>
            </div>
          ))}
        </div>
      </section>
      <div className="circle absolute -right-[50px] -top-[50px] z-0 h-[269px] w-[269px] rounded-full bg-primary_color/90 blur-[250px] md:-top-1/4 md:right-[100px]" />
      <div className="circle absolute -left-[100px] top-1/2 z-0 h-[455px] w-[455px] rounded-full bg-[#6828A7]/60 blur-[250px]" />
    </footer>
  );
};

export default Footer;
