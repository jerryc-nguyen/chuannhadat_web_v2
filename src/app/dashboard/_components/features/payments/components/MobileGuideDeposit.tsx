import React from 'react';
import { SMS_SUPPORT_NUMBER } from '@common/constants';
import { QrCode, CreditCard } from 'lucide-react';
import { AlertDialogDescription } from '@components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { AmountSelection } from './AmountSelection';
import { QRImage } from './QRImage';
import { BankInfo } from './BankInfo';
import { GuideDepositProps } from '../types';
import { formatPhoneNumber } from '@common/stringHelpers';

export const MobileGuideDeposit: React.FC<GuideDepositProps> = ({
  bankTransferNote,
  selectedAmount,
  onAmountSelect
}) => {

  return (
    <div className="w-full space-y-4">
      <AmountSelection
        selectedAmount={selectedAmount}
        onAmountSelect={onAmountSelect}
      />

      <Tabs defaultValue="qr" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-5 py-0 px-1">
          <TabsTrigger value="qr" className="flex items-center gap-2 text-sm">
            <QrCode className="h-4 w-4" />
            QR Code
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4" />
            Thông tin TK
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="space-y-4">
          <div className="flex justify-center">
            <QRImage
              selectedAmount={selectedAmount}
              bankTransferNote={bankTransferNote}
              className="w-full"
            />
          </div>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <BankInfo
            bankTransferNote={bankTransferNote}
          />
        </TabsContent>
      </Tabs>

      <AlertDialogDescription className="space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Hotline hỗ trợ:</span> {formatPhoneNumber(SMS_SUPPORT_NUMBER)}
          </p>
        </div>
      </AlertDialogDescription>
    </div>
  );
};
