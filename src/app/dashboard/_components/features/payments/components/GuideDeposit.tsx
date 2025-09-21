import {
  BANK_ACCOUNT_NAME,
  BANK_ACCOUNT_NUMBER,
  BANK_ACCOUNT_NUMBER_QR,
  BANK_FULL_NAME,
  SMS_SUPPORT_NUMBER,
  BANK_CODE,
} from '@common/constants';
import { Copy, CopyCheck } from 'lucide-react';
import { AlertDialogDescription } from '@components/ui/alert-dialog';
import { GuideDepositProps } from '../types';

const DEPOSIT_PRESETS = [20000, 50000, 100000];

export const GuideDeposit: React.FC<GuideDepositProps> = ({
  bankTransferNote,
  isCopied,
  onCopy,
  selectedAmount,
  onAmountSelect,
}) => {

  const vietQrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${BANK_ACCOUNT_NUMBER_QR}-compact2.png?amount=${selectedAmount}&addInfo=${bankTransferNote}&accountName=${BANK_ACCOUNT_NAME}`;
  return (
    <>
      <section className="w-full">
        <h3 className="mb-3 font-bold">
          Chọn số tiền nạp
        </h3>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {DEPOSIT_PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onAmountSelect(amount)}
              className={`
                h-12 rounded-lg border-2 text-sm font-semibold transition-all
                ${selectedAmount === amount
                  ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              {amount.toLocaleString('vi-VN')} VND
            </button>
          ))}
        </div>

      </section>

      <section className="flex h-fit flex-col items-center justify-between gap-5 md:flex-row">
        <section className="relative w-3/4 rounded-lg border px-3 py-1 shadow-md sm:w-1/2">
          <img
            alt={BANK_ACCOUNT_NAME}
            src={vietQrUrl}
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

    </>
  );
};
