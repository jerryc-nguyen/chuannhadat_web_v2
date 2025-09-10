import Image from 'next/image';
import React from 'react';

const VipNewsPage = () => {
  const listVipNews = [
    {
      id: 1,
      title: 'Tin Siêu VIP',
      desciprtion: (
        <p className="text-sm lg:text-base">
          Là loại tin được đăng tiêu đề bằng chữ{' '}
          <span className="font-semibold uppercase text-red-500">in màu đỏ</span>, được hưởng
          nhiều ưu tiên và hiệu quả giao dịch cao nhất.
        </p>
      ),
      image: 'https://images.chuannhadat.com/images/vip_1.jpg',
    },
    {
      id: 2,
      title: 'Tin VIP+ (đã ngưng cung cấp)',
      desciprtion: (
        <p className="text-sm lg:text-base">
          Là loại tin được đăng tiêu đề bằng chữ{' '}
          <span className="font-semibold uppercase text-orange-500">in màu cam</span>, được
          hưởng nhiều ưu, nằm dưới tin VIP 1 và trên tất cả các loại tin khác.
        </p>
      ),
      image: 'https://images.chuannhadat.com/images/vip_2.jpg',
    },
    {
      id: 3,
      title: 'Tin VIP',
      desciprtion: (
        <p className="text-sm lg:text-base">
          Là loại tin được đăng tiêu đề bằng chữ{' '}
          <span className="font-semibold uppercase text-blue-500">in màu Xanh</span>, nằm dưới
          tin VIP 1, VIP 2 và trên tin thường.
        </p>
      ),
      image: 'https://images.chuannhadat.com/images/vip_3.jpg',
    },
    {
      id: 4,
      title: 'Tin thường',
      desciprtion: (
        <p className="text-sm lg:text-base">
          Là loại tin được đăng tiêu đề bằng chữ thường màu xanh, hiển thị dưới các loại tin VIP.
        </p>
      ),
      image: 'https://images.chuannhadat.com/images/tin_thuong.jpg',
    },
  ];

  return (
    <section className="mx-auto w-full py-10 text-lg md:w-4/5">
      <h1 className="mb-10 text-nowrap text-3xl font-bold lg:text-5xl">Giới thiệu tin vip</h1>
      <section className="flex flex-col gap-y-3">
        {listVipNews.map((news) => (
          <section key={news.id} className="rounded-md border p-4 pt-0 shadow-sm">
            <h2 className="mb-2 mt-4 text-xl font-bold lg:text-2xl">{news.title}</h2>
            {news.desciprtion}
            <div className="relative mt-3 aspect-[4/1] h-fit w-full overflow-hidden rounded-md border">
              <Image className="object-cover" fill alt="image-guide" src={news.image} />
            </div>
          </section>
        ))}
      </section>
    </section>
  );
};

export default VipNewsPage;
