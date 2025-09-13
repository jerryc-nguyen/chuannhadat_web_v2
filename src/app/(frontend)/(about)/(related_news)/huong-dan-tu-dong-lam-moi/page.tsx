import Image from 'next/image';
import React from 'react';
import preview2 from '@assets/images/preview1.png';
import preview from '@assets/images/preview.png';
type GuideAutoRefreshPageProps = object;

const GuideAutoRefreshPage: React.FC<GuideAutoRefreshPageProps> = () => {
  return (
    <section className="mx-auto w-full py-10 text-lg md:w-4/5">
      <h1 className="mb-10 text-nowrap text-3xl font-bold lg:text-5xl">
        Hướng dẫn tự động làm mới
      </h1>
      <h2 className="mb-2 mt-4 text-xl font-bold lg:text-2xl">
        Để sử dụng chức năng tự động làm mới tin các bạn cần hoàn thành 2 bước:
      </h2>
      <ul className="my-3 list-inside list-disc">
        <li className="text-sm lg:text-base">Bước 1: Cài đặt thời gian tự động làm mới tin đăng</li>
        <li className="text-sm lg:text-base">Bước 2: Chọn tin muốn tự động làm mới</li>
      </ul>
      <section className="mb-3 rounded-md border p-4 pt-0 shadow-sm">
        <h2 className="mb-2 mt-4 text-xl font-bold lg:text-2xl">
          Bước 1. Cài đặt thời gian tự động làm mới tin đăng
        </h2>
        <ul>
          <li className="text-sm lg:text-base">
            - Bạn vào phần <b>Quản lý tin đăng {'>'} Cài đặt thời gian tự động làm mới tin đăng</b>
          </li>
          <li className="text-sm lg:text-base">
            - Click chọn: <b>Thêm thời gian tự động làm mới</b>
          </li>
        </ul>
        <div className="relative mt-3 aspect-[2/1] h-fit w-full overflow-hidden rounded-md border">
          <Image className="object-contain" fill alt="image-guide" src={preview} />
        </div>
        <li className="mt-2 list-none text-sm lg:text-base">
          - Chọn giờ và phút để chạy chức năng làm mới sau đó click <b>Thêm</b>
        </li>
      </section>
      <section className="mb-3 rounded-md border p-4 pt-0 shadow-sm">
        <h2 className="mb-2 mt-4 text-xl font-bold lg:text-2xl">
          Bước 2. Chọn tin muốn tự động làm mới
        </h2>
        <ul>
          <li className="text-sm lg:text-base">
            - Bạn vào phần <b>Quản lý tin đăng {'>'} Danh sách tin</b>
          </li>
          <li className="text-sm lg:text-base">
            - Chọn <b>Làm mới tin tự động</b> trong phần mô tả của mỗi tin
          </li>
        </ul>
        <div className="relative mt-3 aspect-[2/1] h-fit w-full overflow-hidden rounded-md border">
          <Image className="object-contain" fill alt="image-guide" src={preview2} />
        </div>
      </section>
      <section className="my-4">
        <h2 className="mb-2 mt-4 text-xl font-bold lg:text-2xl">Kết quả:</h2>
        <p className="text-sm lg:text-base">
          Kết quả: Theo như hình trên thì:{' '}
          <b>8 giờ sáng và 2 giờ chiều, 2 tin được chọn sẽ được làm mới</b> <br />
          Sau 1 ngày, <b>số lần làm mới của bạn sẽ bị trừ 4</b> vì sáng làm mới 2 tin, chiều làm mới
          2 tin
        </p>
      </section>

      <section className="mb-3 rounded-md border p-4 pt-0 shadow-sm">
        <h2 className="mb-2 mt-4 text-xl font-bold lg:text-2xl">
          Cách chọn nhiều tin muốn tự động làm mới 1 lúc
        </h2>
        <p className="text-sm lg:text-base">
          Ví dụ: Bạn muốn làm mới tự động cho các tin theo tiêu chí: Nhà bán ở quận Bình Thạnh, có
          giá 5-6 tỷ
          <br />
          Đầu tiên bạn hãy lọc tin đăng theo tiêu trí mong muốn: Nhà bán ở quận Bình Thạnh, có giá
          5-6 tỷ
        </p>
        <ul>
          <li className="text-sm lg:text-base">
            - Bước 1: Dùng chức năng: Chọn tất cả các tin trên trang
          </li>
          <li className="text-sm lg:text-base">
            - Bước 2 & 3: Chọn thao tác hàng loạt: Bật tự động làm mớiChọn{' '}
            <b>Làm mới tin tự động</b> trong phần mô tả của mỗi tin
          </li>
        </ul>
        <div className="relative mt-3 aspect-[2/1] h-fit w-full overflow-hidden rounded-md border">
          <Image
            className="object-contain"
            fill
            alt="image-guide"
            src={
              'https://images.chuannhadat.com/cms-files/10001/cach-chon-nhieu-tin-muon-tu-dong-lam-moi-1-luc-d9b5d12e.png?w=1200'
            }
          />
        </div>
      </section>
    </section>
  );
};

export default GuideAutoRefreshPage;
