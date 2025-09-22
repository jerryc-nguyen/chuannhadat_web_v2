import { CircleCheck } from 'lucide-react';
import { TransactionSuccessfulProps } from '../types';
import { useDepositModal } from '@app/dashboard/_components/features/payments/hooks/useDepositModal';

export const TransactionSuccessful: React.FC<TransactionSuccessfulProps> = ({
  formattedAmount,
}) => {
  const { transferedAmount } = useDepositModal();
  return (
    <section className="flex flex-col items-center gap-y-2">
      <div className="mb-2 flex items-center justify-center rounded-full bg-success_color/10 p-5">
        <CircleCheck className="text-5xl text-success_color" />
      </div>
      <h3 className="text-lg font-semibold">Chuyển khoản thành công</h3>
      <p className="my-4 text-4xl text-success_color">{transferedAmount || formattedAmount}</p>
      <p>
        Cảm ơn bạn đã sử dụng và ủng hộ <b>ChuanNhaDat</b>🤗🥰
      </p>
    </section>
  );
};
