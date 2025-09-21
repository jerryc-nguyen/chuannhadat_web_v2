import { BANK_ACCOUNT_NAME, BANK_ACCOUNT_NUMBER_QR, BANK_CODE } from '@common/constants';

interface TopUpQRProps {
  bankTransferNote: string;
}

export const TopUpQR: React.FC<TopUpQRProps> = ({ bankTransferNote }) => {
  return (
    <div className="mb-12 mt-4 flex flex-col items-center gap-y-2">
      <h3 className="mb-2 text-xl font-bold">Quét mã QR để thanh toán</h3>

      <img
        alt="Nguyen Van Linh"
        src={`https://img.vietqr.io/image/${BANK_CODE}-${BANK_ACCOUNT_NUMBER_QR}-compact2.png?addInfo=${bankTransferNote}&accountName=${BANK_ACCOUNT_NAME}`}
        width="300"
      />
    </div>
  );
};
