import { cn } from '@common/utils';
import { HttpStatusCode } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import empty_city from '@assets/images/empty-city.png';

type NotFoundProps = {
  errorCode?: HttpStatusCode;
  errorMessage?: string;
  className?: string;
};

export default function NotFound(props: NotFoundProps) {
  const {
    errorCode = HttpStatusCode.NotFound,
    errorMessage = 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    className,
  } = props;

  return (
    <section className="mb-5 flex min-h-[70vh] flex-col items-center justify-center p-5">
      <Image className="w-full md:w-1/2" src={empty_city} alt="no-notification" />
      <h3 className="text-lg font-bold">Không tìm thấy nội dung</h3>
      <p className="mt-2 w-3/4 text-center text-sm text-foreground">
        Không tìm thấy bài đăng nào phù hợp với yêu cầu của bạn, hãy thử lại với khu vực, điều kiện
        khác.
      </p>
      <Link
        className="flex items-center gap-x-4 rounded-full border-2 border-black px-4 py-2 text-xl transition-all hover:bg-black hover:text-neutral_03 md:text-2xl mt-4"
        href="/"
      >
        Về trang chủ
      </Link>
    </section>
  );
}
