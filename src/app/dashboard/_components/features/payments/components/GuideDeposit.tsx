import React from 'react';
import { SMS_SUPPORT_NUMBER } from '@common/constants';
import { AlertDialogDescription } from '@components/ui/alert-dialog';
import { AmountSelection } from './AmountSelection';
import { QRImage } from './QRImage';
import { BankInfo } from './BankInfo';
import { GuideDepositProps } from '../types';
import { formatPhoneNumber } from '@common/stringHelpers';

export const GuideDeposit: React.FC<GuideDepositProps> = ({
  bankTransferNote,
  selectedAmount,
  onAmountSelect
}) => {
  return (
    <>
      <AmountSelection
        selectedAmount={selectedAmount}
        onAmountSelect={onAmountSelect}
      />

      <section className="flex h-fit flex-col items-center justify-between gap-5 md:flex-row">
        <QRImage
          selectedAmount={selectedAmount}
          bankTransferNote={bankTransferNote}
          className="w-3/4 px-3 py-1 sm:w-1/2"
          height={315}
        />
        <BankInfo
          bankTransferNote={bankTransferNote}
        />
      </section>

      <AlertDialogDescription>
        <p className="my-2">
          Nếu có vấn đề trong khi thanh toán - bạn gọi số{' '}
          <b className="text-primary_color">{formatPhoneNumber(SMS_SUPPORT_NUMBER)}</b>
        </p>
      </AlertDialogDescription>

    </>
  );
};
