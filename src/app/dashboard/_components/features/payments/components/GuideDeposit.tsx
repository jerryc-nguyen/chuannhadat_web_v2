import React from 'react';
import {
  BANK_ACCOUNT_NAME,
  BANK_ACCOUNT_NUMBER,
  BANK_ACCOUNT_NUMBER_QR,
  BANK_FULL_NAME,
  SMS_SUPPORT_NUMBER,
  BANK_CODE,
} from '@common/constants';
import { Copy, CopyCheck, RefreshCw } from 'lucide-react';
import { AlertDialogDescription } from '@components/ui/alert-dialog';
import { AmountSelection } from './AmountSelection';
import { GuideDepositProps } from '../types';
import { formatPhoneNumber } from '@common/stringHelpers';

export const GuideDeposit: React.FC<GuideDepositProps> = ({
  bankTransferNote,
  isCopied,
  onCopy,
  selectedAmount,
  onAmountSelect
}) => {
  const [rebuildKey, setRebuildKey] = React.useState(0);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  const vietQrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${BANK_ACCOUNT_NUMBER_QR}-compact2.png?amount=${selectedAmount}&addInfo=${bankTransferNote}&accountName=${BANK_ACCOUNT_NAME}&t=${rebuildKey}`;

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
    // Auto-retry after a short delay
    setTimeout(() => {
      setRebuildKey(prev => prev + 1);
      setImageError(false);
      setIsImageLoading(true);
    }, 1000);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleManualRebuild = () => {
    setRebuildKey(prev => prev + 1);
    setImageError(false);
    setIsImageLoading(true);
  };

  // Reset image state when amount changes
  React.useEffect(() => {
    setIsImageLoading(true);
    setImageError(false);
    setRebuildKey(prev => prev + 1);
  }, [selectedAmount, bankTransferNote]);
  return (
    <>
      <AmountSelection
        selectedAmount={selectedAmount}
        onAmountSelect={onAmountSelect}
      />

      <section className="flex h-fit flex-col items-center justify-between gap-5 md:flex-row">
        <section className="relative w-3/4 rounded-lg border px-3 py-1 shadow-md sm:w-1/2">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-600">Đang tải QR...</p>
              </div>
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-red-600">Không tải được QR</p>
                <button
                  onClick={handleManualRebuild}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Thử lại
                </button>
              </div>
            </div>
          )}
          <img
            alt={BANK_ACCOUNT_NAME}
            src={vietQrUrl}
            width="300"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={isImageLoading || imageError ? 'opacity-0' : 'opacity-100'}
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
          Nếu có vấn đề trong khi thanh toán - bạn gọi số{' '}
          <b className="text-primary_color">{formatPhoneNumber(SMS_SUPPORT_NUMBER)}</b>
        </p>
      </AlertDialogDescription>

    </>
  );
};
