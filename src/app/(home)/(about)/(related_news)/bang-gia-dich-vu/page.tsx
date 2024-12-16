import CardPackage from '@components/ui/CardPackage';
import Link from 'next/link';
import React from 'react';

type ServicePriceProps = object;

const ServicePrice: React.FC<ServicePriceProps> = () => {
  return (
    <section className="mx-auto w-full py-10 text-lg md:w-4/5">
      <h1 className="mb-10 text-nowrap text-3xl font-bold lg:text-5xl">Bảng giá dịch vụ</h1>
      <section className="pb-4">
        <h2 className="mb-2 mt-4 text-xl font-bold lg:text-2xl">Gói combo cho môi giới</h2>
        <p className="text-sm lg:text-base">
          Gói COMBO tiết kiệm chi phí đăng tin VIP cho môi giới.
        </p>
        <p className="text-sm lg:text-base">
          Giúp bạn linh hoạt và dễ dàng thay đổi loại tin vip cho các tin đã đăng
        </p>
        <section className="mt-4 flex flex-wrap gap-x-4 gap-y-4">
          <CardPackage
            cardTitle="Combo môi giới 1"
            pricePackage="200k Xu"
            unitTime="tháng"
            description="Gói combo môi giới giúp tin của bạn được lên Top và được hiển thị ưu tiên."
            listPreferential={['Số tin Vip 1: 1', 'Số tin Vip 2: 2', 'Số tin Vip 3: 3']}
          />
          <CardPackage
            cardTitle="Combo môi giới 2"
            pricePackage="300k Xu"
            unitTime="tháng"
            description="Gói combo môi giới giúp tin của bạn được lên Top và được hiển thị ưu tiên."
            listPreferential={['Số tin Vip 1: 3', 'Số tin Vip 2: 3', 'Số tin Vip 3: 3']}
          />
          <CardPackage
            cardTitle="Combo môi giới 3"
            pricePackage="500k Xu"
            unitTime="tháng"
            description="Gói combo môi giới giúp tin của bạn được lên Top và được hiển thị ưu tiên."
            listPreferential={['Số tin Vip 1: 5', 'Số tin Vip 2: 5', 'Số tin Vip 3: 5']}
          />
        </section>
      </section>
      <section>
        <h2 className="mb-2 mt-4 text-2xl font-bold">Gói làm mới tin</h2>
        <p className="text-sm lg:text-base">
          Gói làm mới tin đăng giúp bạn tiết kiệm thời gian và đẩy tin lên top
        </p>
        <Link
          href={'#'}
          className="text-sm text-primary_color/80 transition-all hover:text-primary_color hover:underline lg:text-base"
        >
          Xem hướng dẫn cài đặt tự động làm mới tin giúp bạn tiết kiệm thời gian
        </Link>
        <section className="mt-4 flex flex-wrap gap-x-4 gap-y-4">
          <CardPackage
            cardTitle="Gói làm mới 1"
            pricePackage="100 Xu"
            unitTime="tháng"
            description="Gói làm mới tin đăng giúp bạn tiết kiệm thời gian và đẩy tin lên top"
            listPreferential={['Số lần làm mới tin: 300']}
          />
          <CardPackage
            cardTitle="Gói làm mới 2"
            pricePackage="200 Xu"
            unitTime="tháng"
            description="Gói làm mới tin đăng giúp bạn tiết kiệm thời gian và đẩy tin lên top"
            listPreferential={['Số lần làm mới tin: 800']}
          />
          <CardPackage
            cardTitle="Gói làm mới 3"
            pricePackage="500 Xu"
            unitTime="tháng"
            description="Gói làm mới tin đăng giúp bạn tiết kiệm thời gian và đẩy tin lên top"
            listPreferential={['Số lần làm mới tin: 2000']}
          />
        </section>
      </section>
    </section>
  );
};

export default ServicePrice;
