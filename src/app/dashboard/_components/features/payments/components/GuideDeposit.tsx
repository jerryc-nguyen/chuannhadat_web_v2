import {
  BANK_ACCOUNT_NAME,
  BANK_ACCOUNT_NUMBER,
  BANK_FULL_NAME,
  SMS_SUPPORT_NUMBER,
} from '@common/constants';
import { Copy, CopyCheck } from 'lucide-react';
import { AlertDialogDescription } from '@components/ui/alert-dialog';
import { GuideDepositProps } from '../types';

export const GuideDeposit: React.FC<GuideDepositProps> = ({
  bankTransferNote,
  isCopied,
  onCopy,
}) => {
  return (
    <>
      <AlertDialogDescription>
        <p className="my-2">
          Bạn vui lòng ghi đúng nội dung chuyển khoản:{' '}
          <b className="text-primary_color">{bankTransferNote}</b>
        </p>
        <p className="my-2">
          Nếu có vấn đề trong khi thanh toán - thường là không nhập đúng nội dung CK, bạn gọi số{' '}
          <b className="text-primary_color">{SMS_SUPPORT_NUMBER}</b>
        </p>
      </AlertDialogDescription>

      <section className="flex h-fit flex-col items-center justify-between gap-5 md:flex-row">
        <section className="relative w-3/4 rounded-lg border px-3 py-1 shadow-md sm:w-1/2">
          <img
            alt="Nguyen Van Linh"
            src={`https://img.vietqr.io/image/TPB-51938398888-compact2.png?addInfo=${bankTransferNote}&accountName=NGUYEN%20VAN%20LINH`}
            width="300"
          />
        </section>
        <section className="box-border flex h-full w-full flex-col items-start justify-start gap-y-2 rounded-lg border bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 p-5 text-left leading-6 shadow-md md:w-1/2">
          <div>
            <p className="font-semibold text-foreground">Tài khoản</p>
            <div className="flex items-center gap-x-2">
              <p>{BANK_ACCOUNT_NUMBER}</p>
              {isCopied ? (
                <CopyCheck className="text-xl text-green-500" />
              ) : (
                <Copy onClick={onCopy} className="cursor-pointer text-sm text-gray-500" />
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-foreground">Ngân hàng</p>
            <p>{BANK_FULL_NAME}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Tên tài khoản</p>
            <p>{BANK_ACCOUNT_NAME}</p>
          </div>
        </section>
      </section>
    </>
  );
};
