import React from 'react';
import {
  BANK_ACCOUNT_NAME,
  BANK_ACCOUNT_NUMBER,
  BANK_ACCOUNT_NUMBER_QR,
  BANK_FULL_NAME,
} from '@common/constants';
import { Copy, CopyCheck } from 'lucide-react';
import useCleanupEffect from '@common/hooks/useCleanupEffect';

interface BankInfoProps {
  className?: string;
  bankTransferNote: string;
}

export const BankInfo: React.FC<BankInfoProps> = ({
  className = '',
  bankTransferNote
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const [isCopiedTransferNote, setIsCopiedTransferNote] = React.useState(false);

  useCleanupEffect(
    (helpers) => {
      if (isCopied) {
        helpers.setTimeout(() => {
          setIsCopied(false);
        }, 4000);
      }
    },
    [isCopied],
  );

  useCleanupEffect(
    (helpers) => {
      if (isCopiedTransferNote) {
        helpers.setTimeout(() => {
          setIsCopiedTransferNote(false);
        }, 4000);
      }
    },
    [isCopiedTransferNote],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(BANK_ACCOUNT_NUMBER_QR);
    setIsCopied(true);
  };

  const handleCopyTransferNote = () => {
    navigator.clipboard.writeText(bankTransferNote);
    setIsCopiedTransferNote(true);
  };
  return (
    <section className={`box-border flex h-full w-full flex-col items-start justify-start gap-y-2 rounded-lg border bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 p-5 text-left leading-6 shadow-md md:w-1/2 ${className}`}>
      <div>
        <p className="font-semibold text-foreground">Tài khoản</p>
        <div className="flex items-center gap-x-2">
          <p>{BANK_ACCOUNT_NUMBER}</p>
          {isCopied ? (
            <CopyCheck className="text-xl text-green-500" />
          ) : (
            <Copy onClick={handleCopy} className="cursor-pointer text-sm text-gray-500" />
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
      <div>
        <p className="font-semibold text-foreground">Nội dung chuyển khoản</p>
        <div className="flex items-center gap-x-2">
          <p className="font-mono text-sm bg-yellow-100 px-2 py-1 rounded">{bankTransferNote}</p>
          {isCopiedTransferNote ? (
            <CopyCheck className="text-xl text-green-500" />
          ) : (
            <Copy onClick={handleCopyTransferNote} className="cursor-pointer text-sm text-gray-500" />
          )}
        </div>
      </div>
    </section>
  );
};
