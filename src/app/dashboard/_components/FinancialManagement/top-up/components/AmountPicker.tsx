import { useDepositModal } from '@dashboard/features/payments';
import React from 'react';

const DEPOSIT_PRESETS = [20000, 50000, 100000];

const MINIMUM_AMOUNT = 20000;

export const AmountPicker: React.FC = () => {
  const { onOpenModalDeposit, selectedAmount, handleAmountSelect, clearAmount } = useDepositModal();
  const [customAmount, setCustomAmount] = React.useState<string>('');
  const [validationError, setValidationError] = React.useState<string>('');

  const handleTransferClick = () => {
    if (selectedAmount && !validationError) {
      onOpenModalDeposit();
    }
  };

  const validateAmount = (value: string) => {
    const numValue = parseInt(value.replace(/[^\d]/g, ''));
    if (value === '') {
      return '';
    }
    if (isNaN(numValue) || numValue < MINIMUM_AMOUNT) {
      return `Số tiền tối thiểu là ${MINIMUM_AMOUNT.toLocaleString('vi-VN')} VND`;
    }
    return '';
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);

    // Validate independently
    const error = validateAmount(value);
    setValidationError(error);

    // If valid, update selected amount
    if (!error && value) {
      const numValue = parseInt(value.replace(/[^\d]/g, ''));
      handleAmountSelect(numValue);
    } else if (!value) {
      clearAmount();
    }
  };

  // Clear validation error when selectedAmount changes (from presets)
  React.useEffect(() => {
    if (selectedAmount) {
      setValidationError('');
    }
  }, [selectedAmount]);

  // Don't auto-clear - let user explicitly clear if needed

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Nạp tiền vào tài khoản
      </h2>

      <div className="space-y-6">

        {/* Custom Amount Input */}
        <div className="my-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Nhập số tiền cần nạp:
          </h3>
          <div className="relative">
            <input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Ví dụ: 50000"
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              VND
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Hoặc chọn từ gợi ý:
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {DEPOSIT_PRESETS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => { handleAmountSelect(amount); setCustomAmount(amount.toString()) }}
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

          {/* Validation Error */}
          {validationError && (
            <div className="mb-4">
              <p className="text-sm text-red-600 font-medium">{validationError}</p>
            </div>
          )}

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
            disabled={!selectedAmount || !!validationError}
            className={`
              px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all
              ${selectedAmount && !validationError
                ? 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            Tạo QR chuyển khoản
          </button>
          {(!selectedAmount || validationError) && (
            <p className="text-sm text-gray-500 mt-2">
              {validationError || 'Vui lòng chọn số tiền để tiếp tục'}
            </p>
          )}
        </div>
      </div>
    </div >
  );
};
