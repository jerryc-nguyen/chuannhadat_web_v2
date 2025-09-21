import { useDepositModal } from '@dashboard/features/payments';
import React from 'react';

const DEPOSIT_PRESETS = [20000, 50000, 100000];

export const AmountPicker: React.FC = () => {
  const { onOpenModalDeposit, selectedAmount, handleAmountSelect } = useDepositModal();

  const handleTransferClick = () => {
    if (selectedAmount) {
      onOpenModalDeposit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Nạp tiền vào tài khoản
      </h2>

      <div className="space-y-6">
        {/* Amount Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Chọn số tiền nạp
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {DEPOSIT_PRESETS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleAmountSelect(amount)}
                className={`
                  h-14 rounded-lg border-2 text-lg font-semibold transition-all
                  ${selectedAmount === amount
                    ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
              >
                {amount.toLocaleString('vi-VN')} VND
              </button>
            ))}
          </div>
          {selectedAmount && (
            <div className="text-center mb-4">
              <p className="text-xl font-bold text-blue-600">
                Số tiền đã chọn: {selectedAmount.toLocaleString('vi-VN')} VND
              </p>
            </div>
          )}
        </div>

        {/* Transfer Button */}
        <div className="text-center">
          <button
            onClick={handleTransferClick}
            disabled={!selectedAmount}
            className={`
              px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all
              ${selectedAmount
                ? 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            Tạo QR Chuyển khoản
          </button>
          {!selectedAmount && (
            <p className="text-sm text-gray-500 mt-2">
              Vui lòng chọn số tiền để tiếp tục
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
