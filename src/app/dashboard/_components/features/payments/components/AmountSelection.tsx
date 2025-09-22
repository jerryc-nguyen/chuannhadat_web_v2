import React from 'react';

const DEPOSIT_PRESETS = [20000, 50000, 100000];

interface AmountSelectionProps {
  selectedAmount: number | null;
  onAmountSelect: (amount: number) => void;
}

export const AmountSelection: React.FC<AmountSelectionProps> = ({
  selectedAmount,
  onAmountSelect,
}) => {
  // If selectedAmount is not in presets, show only the selected amount
  const isCustomAmount = selectedAmount && !DEPOSIT_PRESETS.includes(selectedAmount);

  return (
    <section className="w-full">
      {isCustomAmount ? (
        <div className="mb-4">
          <b className="mb-3 font-bold">
            Số tiền bạn muốn nạp:
          </b>
          <div className="text-center">
            <span className="inline-block mt-4 px-4 py-4 font-bold text-2xl rounded-lg border-2 border-blue-200">
              {selectedAmount.toLocaleString('vi-VN')} VND
            </span>
          </div>
        </div>
      ) : (
        <>
          <h3 className="mb-3 font-bold">
            Chọn số tiền nạp
          </h3>

          <div className="grid gap-3 mb-4 grid-cols-3">
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
        </>
      )}
    </section>
  );
};
