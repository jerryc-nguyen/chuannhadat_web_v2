import { Dialog, DialogContent } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Service } from '../../types';
import { useMemo, useState } from 'react';
import { RadioGroup } from '@components/ui/Radio';
import { useDepositModal } from '@dashboard/features/payments';

interface Props {
  plan: Service;
  onClose: () => void;
}

const SubscriptionDialog: React.FC<Props> = ({ plan, onClose }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const { onOpenModalDeposit } = useDepositModal();
  const calculatePrice = (total: number, discount: number) => {
    return total * ((100 - discount) / 100);
  };

  const pricingOptions = [
    { label: '1 tháng', originalPrice: plan.buy_info.total, discount: 0, value: 0 },
    { label: '3 tháng', originalPrice: plan.buy_info.total * 3, discount: 5, value: 1 },
    { label: '6 tháng', originalPrice: plan.buy_info.total * 6, discount: 20, value: 2 },
    { label: '12 tháng', originalPrice: plan.buy_info.total * 12, discount: 30, value: 3 },
  ];

  const selectedOption = pricingOptions[selectedOptionIndex];
  const finalPrice = useMemo(
    () => calculatePrice(selectedOption.originalPrice, selectedOption.discount),
    [selectedOptionIndex],
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handlePayment = () => { };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <div className="p-4">
          <div className="mb-4 text-lg font-bold">Bạn đang chọn gói: {plan.plan_name}</div>
          <RadioGroup
            options={pricingOptions.map((option) => {
              const discountBadge =
                option.discount > 0 ? (
                  <span className="ml-2 rounded-full bg-red-500 px-2 text-xs text-white">{`${option.discount}%`}</span>
                ) : null;

              return {
                label: (
                  <div>
                    <span>{option.label}</span>
                    {discountBadge}
                    <div className="mt-1 text-sm text-gray-500">
                      <span className={`line-through ${option.discount > 0 ? 'text-red-500' : ''}`}>
                        {option.originalPrice.toLocaleString()} Xu
                      </span>
                      {option.discount > 0 && (
                        <span className="ml-2 font-bold">
                          {calculatePrice(option.originalPrice, option.discount).toLocaleString()}{' '}
                          Xu
                        </span>
                      )}
                    </div>
                  </div>
                ),
                value: option.value,
              };
            })}
            selectedValue={selectedOptionIndex}
            onChange={setSelectedOptionIndex}
          />
          <div className="mt-6">
            <span className="font-bold">Chi tiết thanh toán</span>
            <div className="my-2">Bạn trả: {finalPrice.toLocaleString()} Xu</div>
            <div className="mt-1 rounded-md border p-2 text-sm text-gray-500">
              - Mỗi tháng tương đương 30 ngày.
              <br />
              - Hệ thống sẽ tính phí ngay tại thời điểm đăng ký.
              <br />
              - Gói dịch vụ sẽ tự động gia hạn vào cuối kỳ.
              <br />- Bạn có thể tắt chế độ tự động nếu không có nhu cầu.
            </div>
            {finalPrice && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="text-red-600">
                  Số dư không đủ để thanh toán. Vui lòng nạp thêm tiền.
                </div>
                <Button
                  className="bg-red-600 text-white"
                  onClick={() => onOpenModalDeposit()}
                  variant="outline"
                >
                  Nạp tiền
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button onClick={onClose} variant="outline">
            Hủy
          </Button>
          <Button onClick={handlePayment} disabled={!!finalPrice}>
            Thanh toán
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
