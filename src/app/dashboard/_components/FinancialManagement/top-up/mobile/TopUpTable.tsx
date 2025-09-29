import {
  BANK_ACCOUNT_NAME,
  BANK_FULL_NAME,
  BANK_CODE,
  BANK_ACCOUNT_NUMBER,
} from '@common/constants';
import { Copy } from 'lucide-react';
import { Button } from '@components/ui/button';
import { useState } from 'react';

interface TopUpTableMobileProps {
  bankTransferNote: string;
}

export const TopUpTableMobile: React.FC<TopUpTableMobileProps> = ({ bankTransferNote }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="info-transfer-bank">
      <div className="info-title-transfer-bank flex items-center justify-between px-3 py-3 border-b">
        <h3 className="text-base font-semibold text-xl">Thông tin ngân hàng</h3>
        <img
          alt="payment"
          height="28"
          className="h-7"
          src="https://spaces.chuannhadat.com/icons/payment_methods/bank-transfer.png"
        />
      </div>

      <div className="mt-4">
        <div className="space-y-3">
          <div className="bg-white rounded-lg border p-3 space-y-2">
            <span className="text-xs font-medium text-gray-600">Ngân hàng</span>
            <div className="text-sm">
              <strong className="text-red-600">{BANK_CODE}</strong> - {BANK_FULL_NAME}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Chủ tài khoản</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(BANK_ACCOUNT_NAME, 'owner')}
                className="h-7 px-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-sm font-medium uppercase">
              {BANK_ACCOUNT_NAME}
              {copiedField === 'owner' && <span className="text-green-600 ml-2 text-xs">✓ Đã sao chép</span>}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Số tài khoản</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(BANK_ACCOUNT_NUMBER, 'account')}
                className="h-7 px-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-sm font-medium">
              {BANK_ACCOUNT_NUMBER}
              {copiedField === 'account' && <span className="text-green-600 ml-2 text-xs">✓ Đã sao chép</span>}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-3 space-y-2">
            <span className="text-xs font-medium text-gray-600">Chi nhánh</span>
            <div className="text-sm font-medium uppercase">CN HỒ CHÍ MINH</div>
          </div>

          <div className="bg-white rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Nội dung chuyển khoản</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(bankTransferNote, 'content')}
                className="h-7 px-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-sm font-medium text-red-600">
              {bankTransferNote}
              {copiedField === 'content' && <span className="text-green-600 ml-2 text-xs">✓ Đã sao chép</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
