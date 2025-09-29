'use client';
import { Button } from '@components/ui/button';
import Image from 'next/image';
import React from 'react';
import { Check, Clipboard } from 'lucide-react';

import { useAuth } from '@common/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { referralsApi } from '@dashboard/AccountDetail/api/referrals';
import CommonTableView from '@components/common-table/CommonTableView';
import { IColumnTable } from '@components/common-table';
import { IReferralData } from '@dashboard/AccountDetail/types/referral'
import { Skeleton } from '@components/ui/skeleton';

const ReferFriend: React.FC = () => {
  const [isCopy, setIsCopy] = React.useState(false);
  const { currentUser } = useAuth();
  const { data: listReferral, isPending } = useQuery({
    queryKey: ['list-referral'],
    queryFn: referralsApi.getListReferralFriend,
    select: (data) => data.data,
  });
  const handleCopyUrlRefer = async () => {
    const text = document.getElementById('url-refer')?.innerHTML;
    try {
      await navigator.clipboard.writeText(text || '');
      setIsCopy(true);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  React.useEffect(() => {
    let timeId: NodeJS.Timeout;
    if (isCopy) {
      timeId = setTimeout(() => {
        setIsCopy(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeId);
    };
  }, [isCopy]);
  const columns: IColumnTable[] = [
    {
      key: 'order',
      name: 'Số thứ tự',
      onRenderItemColumn: (_item, index) => {
        return index != undefined ? index + 1 : index;
      },
    },
    {
      key: 'email',
      name: 'Email',
      onRenderItemColumn: (item) => {
        return item.email;
      },
    },
    {
      key: 'phone',
      name: 'Số điện thoại',
      onRenderItemColumn: (item) => {
        return item.phone;
      },
    },
    {
      key: 'fullname',
      name: 'Tên đầy đủ',
      onRenderItemColumn: (item) => {
        return item.fullname;
      },
    },
    {
      key: 'status',
      name: 'Trạng thái',
      onRenderItemColumn: (item) => {
        return item.success ? 'Thành công' : 'Chưa thành công';
      },
    },
  ];
  return (
    <>
      <section className="flex flex-col gap-y-4 md:gap-y-6">
        <div className="border-b pb-3 mb-4">
          <h3 className="text-lg md:text-xl font-semibold">Giới thiệu bạn bè</h3>
        </div>
        <div>
          <h4 className="mb-3 text-center text-base md:text-lg font-semibold">Mã giới thiệu của bạn</h4>
          {currentUser ? (
            <div className="mx-auto flex w-full flex-col md:flex-row justify-center overflow-hidden gap-2 md:gap-0">
              <span
                id="url-refer"
                className="overflow-hidden text-ellipsis whitespace-nowrap rounded-md md:rounded-r-none bg-slate-200 p-3 px-4 text-xs md:text-sm lg:text-base dark:bg-slate-700"
              >
                {`${process.env.NEXT_PUBLIC_BASE_CHUANHADAT_DOMAIN}/gioi-thieu-ban-be/${currentUser?.referral_code}`}
              </span>
              <Button
                onClick={handleCopyUrlRefer}
                variant="outline"
                size="sm"
                className="flex h-12 w-full md:w-fit gap-x-2 md:rounded-l-none px-4"
              >
                {isCopy ? <Check className="text-blue-500 h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                {isCopy ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          ) : (
            <Skeleton className="mx-auto h-12 w-full max-w-[520px]" />
          )}
        </div>
        <div>
          <h4 className="mb-4 text-center text-base md:text-lg font-semibold">Ưu đãi khi giới thiệu bạn bè</h4>
          <div className="flex flex-col gap-y-4 md:gap-y-6 lg:flex-row">
            <div className="flex flex-1 flex-col items-center gap-y-3 md:gap-y-4 lg:border-r px-4">
              <Image
                alt="Bạn là người giới thiệu"
                width={100}
                height={100}
                className="h-[80px] w-[80px] md:h-[100px] md:w-[100px] lg:h-[120px] lg:w-[120px] dark:bg-white"
                src="https://admin.chuannhadat.com/images/referral_1.svg"
              />
              <div className="flex flex-col items-center">
                <span className="text-sm md:text-base font-semibold text-center">Bạn là người giới thiệu</span>
                <ul className="list-outside list-disc px-4 text-center">
                  <li className="text-green-500 text-sm md:text-base">
                    <strong className="text-yellow-500">10,000 Xu</strong> vào tài khoản khuyến mãi
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-y-3 md:gap-y-4 lg:border-l px-4">
              <Image
                alt="Bạn là người được giới thiệu"
                width={100}
                height={100}
                className="h-[80px] w-[80px] md:h-[100px] md:w-[100px] lg:h-[120px] lg:w-[120px] dark:bg-white"
                src="https://admin.chuannhadat.com/images/referral_2.svg"
              />
              <div className="flex flex-col items-center">
                <span className="text-sm md:text-base font-semibold text-center">Bạn là người được giới thiệu</span>
                <ul className="list-outside list-disc px-4 text-center">
                  <li className="text-green-500 text-sm md:text-base">
                    <strong className="text-yellow-500">10,000 Xu</strong> vào tài khoản khuyến mãi
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="mb-3 text-center text-base md:text-lg font-semibold">Quy định về quà tặng</h4>
          <ul className="w-full list-outside list-disc px-4 md:px-5 xl:w-3/5 xl:px-0 space-y-2">
            <li className="text-sm md:text-base">
              Quà tặng sẽ cập nhật trực tiếp vào tài khoản của bạn sau khi người được giới thiệu
              đăng ký bằng mã giới thiệu ở trên và cập nhật đầy đủ thông tin cá nhân, số điện thoại.
            </li>
            <li className="text-sm md:text-base">
              Mỗi phần quà có thời hạn sử dụng <strong>3 tháng</strong> tính từ lúc nhận.
            </li>
            <li className="text-sm md:text-base">Các phần quà còn thời hạn sử dụng sẽ được cộng dồn.</li>
            <li className="text-sm md:text-base">Tất cả phần quà không được quy đổi ra tiền mặt hoặc cho tặng người khác.</li>
            <li className="text-sm md:text-base">
              Chuẩn Nhà Đất có quyền thu hồi đối với các trường hợp có dấu hiệu gian lận hoặc lợi
              dụng để trục lợi.
            </li>
            <li className="text-sm md:text-base">
              Nếu có các thay đổi đối với trương trình và quà tặng Chuẩn Nhà Đất sẽ cập nhật tại
              đây.
            </li>
          </ul>
        </div>
      </section>
      <section className="mt-4 md:mt-6">
        <div className="mb-4 pb-3">
          <h3 className="text-center text-lg md:text-xl font-semibold xl:text-start">
            Danh sách bạn bè đã giới thiệu
          </h3>
        </div>
        <div className="overflow-x-auto">
          <CommonTableView
            isLoading={isPending}
            columns={columns}
            items={listReferral as IReferralData[]}
          />
        </div>
      </section>
    </>
  );
};

export default ReferFriend;
