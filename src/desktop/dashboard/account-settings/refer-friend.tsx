import { Button } from '@components/ui/button';
import Image from 'next/image';
import React from 'react';
import { LuCheck, LuClipboard } from 'react-icons/lu';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyTable } from '../components';

const ReferFriend: React.FC = () => {
  const [isCopy, setIsCopy] = React.useState(false);
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
      }, 3000);
    }
    return () => {
      clearTimeout(timeId);
    };
  }, [isCopy]);
  return (
    <>
      <section className="flex flex-col gap-y-6">
        <div className="border-b pb-4">
          <h3 className="text-xl font-semibold">Giới thiệu bạn bè</h3>
        </div>
        <div>
          <h4 className="mb-2 text-center text-lg font-semibold">Mã giới thiệu của bạn</h4>
          <div className="mx-auto flex justify-center">
            <span
              id="url-refer"
              className="rounded-md rounded-r-none bg-slate-200 p-3 px-4 dark:bg-slate-700"
            >
              https://chuannhadat.com/gioi-thieu-ban-be/PVM507
            </span>

            <Button
              onClick={handleCopyUrlRefer}
              variant="outline"
              size="icon"
              className="flex h-12 w-fit gap-x-2 rounded-l-none px-2"
            >
              {isCopy ? <LuCheck className="text-blue-500" /> : <LuClipboard />}
              {isCopy ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-center text-lg font-semibold">Ưu đãi khi giới thiệu bạn bè</h4>
          <div className="flex">
            <div className="flex flex-1 flex-col items-center gap-y-4 border-r">
              <Image
                alt="Bạn là người giới thiệu"
                width={120}
                height={120}
                className="h-[120px] dark:bg-white"
                src="https://chuannhadat.com/images/referral_1.svg"
              />
              <div className="flex flex-col items-center">
                <span className="text-md font-semibold">Bạn là người giới thiệu</span>
                <ul className="list-disc">
                  <li className="text-green-500">
                    <strong className="text-yellow-500">10,000 Xu</strong> vào tài khoản khuyến mãi
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4 border-l">
              <Image
                alt="Bạn là người giới thiệu"
                width={120}
                height={120}
                className="h-[120px] dark:bg-white"
                src="https://chuannhadat.com/images/referral_2.svg"
              />
              <div className="flex flex-col items-center">
                <span className="text-md font-semibold">Bạn là người được giới thiệu</span>
                <ul className="list-disc">
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
          <ul className="w-3/5 list-disc">
            <li>
              Quà tặng sẽ cập nhật trực tiếp vào tài khoản của bạn sau khi người được giới thiệu
              đăng ký bằng mã giới thiệu ở trên và cập nhật đầy đủ thông tin cá nhân, số điện thoại.
            </li>
            <li>
              3 tháng Mỗi phần quà có thời hạn sử dụng <strong>3 tháng</strong> tính từ lúc nhận.
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
        <div className="mb-4 border-b pb-4">
          <h3 className="text-xl font-semibold">Danh sách bạn bè đã giới thiệu</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Số thứ tự</TableHead>
              <TableHead>Người giới thiệu</TableHead>
              <TableHead>Người tham gia</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <EmptyTable />
        </Table>
      </section>
    </>
  );
};

export default ReferFriend;
