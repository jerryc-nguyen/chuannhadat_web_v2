import { Button } from '@components/ui/button';
import Image from 'next/image';
import React from 'react';
import { LuCheck, LuClipboard } from 'react-icons/lu';

import useAuth from '@mobile/auth/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { services } from '@api/services';
import CommonTableView from '@components/common-table/CommonTableView';
import { IColumnTable } from '@components/common-table';
import { IReferralData } from '@models/modelResponse';

const ReferFriend: React.FC = () => {
  const [isCopy, setIsCopy] = React.useState(false);
  const { currentUser } = useAuth();
  const { data: listReferral, isPending } = useQuery({
    queryKey: ['list-referral'],
    queryFn: services.referralls.getListReferralFriend,
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
        return index != undefined ? index + 1 : index
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
      <section className="flex flex-col gap-y-6">
        <div className="border-b pb-4">
          <h3 className="text-xl font-semibold">Giới thiệu bạn bè</h3>
        </div>
        <div>
          <h4 className="mb-2 text-center text-lg font-semibold">Mã giới thiệu của bạn</h4>
          <div className="mx-auto flex w-full justify-center overflow-hidden">
            <span
              id="url-refer"
              className="overflow-hidden text-ellipsis whitespace-nowrap rounded-md rounded-r-none bg-slate-200 p-3 px-4 text-sm dark:bg-slate-700 lg:text-base"
            >
              {`${process.env.NEXT_PUBLIC_BASE_CHUANHADAT_DOMAIN}/gioi-thieu-ban-be/${currentUser?.referral_code}`}
            </span>
            <Button
              onClick={handleCopyUrlRefer}
              variant="outline"
              size="icon"
              className="flex h-12 w-fit gap-x-2 rounded-l-none px-4"
            >
              {isCopy ? <LuCheck className="text-blue-500" /> : <LuClipboard />}
              {isCopy ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-center text-lg font-semibold">Ưu đãi khi giới thiệu bạn bè</h4>
          <div className="flex flex-col gap-y-4 lg:flex-row">
            <div className="flex flex-1 flex-col items-center gap-y-4 lg:border-r">
              <Image
                alt="Bạn là người giới thiệu"
                width={120}
                height={120}
                className="h-[120px] dark:bg-white"
                src="https://chuannhadat.com/images/referral_1.svg"
              />
              <div className="flex flex-col items-center">
                <span className="text-md font-semibold">Bạn là người giới thiệu</span>
                <ul className="list-outside list-disc px-4 text-center">
                  <li className="text-green-500">
                    <strong className="text-yellow-500">10,000 Xu</strong> vào tài khoản khuyến mãi
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4 lg:border-l">
              <Image
                alt="Bạn là người giới thiệu"
                width={120}
                height={120}
                className="h-[120px] dark:bg-white"
                src="https://chuannhadat.com/images/referral_2.svg"
              />
              <div className="flex flex-col items-center">
                <span className="text-md font-semibold">Bạn là người được giới thiệu</span>
                <ul className="list-outside list-disc px-4 text-center">
                  <li className="text-green-500">
                    <strong className="text-yellow-500">10,000 Xu</strong> vào tài khoản khuyến mãi
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="mb-2 text-center text-lg font-semibold">Quy định về quà tặng</h4>
          <ul className="w-full list-outside list-disc px-5 xl:w-3/5 xl:px-0">
            <li>
              Quà tặng sẽ cập nhật trực tiếp vào tài khoản của bạn sau khi người được giới thiệu
              đăng ký bằng mã giới thiệu ở trên và cập nhật đầy đủ thông tin cá nhân, số điện thoại.
            </li>
            <li>
              Mỗi phần quà có thời hạn sử dụng <strong>3 tháng</strong> tính từ lúc nhận.
            </li>
            <li>Các phần quà còn thời hạn sử dụng sẽ được cộng dồn.</li>
            <li>Tất cả phần quà không được quy đổi ra tiền mặt hoặc cho tặng người khác.</li>
            <li>
              Chuẩn Nhà Đất có quyền thu hồi đối với các trường hợp có dấu hiệu gian lận hoặc lợi
              dụng để trục lợi.
            </li>
            <li>
              Nếu có các thay đổi đối với trương trình và quà tặng Chuẩn Nhà Đất sẽ cập nhật tại
              đây.
            </li>
          </ul>
        </div>
      </section>
      <section className="mt-6">
        <div className="mb-4 pb-4">
          <h3 className="text-center text-xl font-semibold xl:text-start">
            Danh sách bạn bè đã giới thiệu
          </h3>
        </div>
        <CommonTableView
          isLoading={isPending}
          columns={columns}
          items={listReferral as IReferralData[]}
        />
      </section>
    </>
  );
};

export default ReferFriend;
