import {
  BANK_ACCOUNT_NAME,
  BANK_FULL_NAME,
  BANK_CODE,
} from '@common/constants';
import TableComponent from '@components/table';
import { getTableData } from '../constants';
import { TopUpTableColumn } from '../types';

interface TopUpTableProps {
  bankTransferNote: string;
}

export const TopUpTable: React.FC<TopUpTableProps> = ({ bankTransferNote }) => {
  const columns: TopUpTableColumn[] = [
    {
      title: 'Ngân hàng',
      dataIndex: 'bank_code',
      key: 'bank_code',
      render: (_value: string) => {
        return (
          <span>
            <strong style={{ color: 'red' }}> {BANK_CODE}</strong> - {BANK_FULL_NAME}
          </span>
        );
      },
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'account_owner',
      key: 'account_owner',
      render: (_value: string) => (
        <span
          style={{
            textTransform: 'uppercase',
          }}
        >
          {BANK_ACCOUNT_NAME}
        </span>
      ),
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'account_number',
      key: 'account_number',
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      key: 'branch',
      render: (_value: string) => (
        <span
          style={{
            textTransform: 'uppercase',
          }}
        >
          {_value}
        </span>
      ),
    },
    {
      title: 'Nội dung chuyển khoản',
      dataIndex: 'content',
      key: 'content',
      render: (_value: string) => (
        <span
          style={{
            color: 'red',
          }}
        >
          {bankTransferNote}
        </span>
      ),
    },
  ];

  const data = getTableData(bankTransferNote);

  return (
    <div className="info-transfer-bank">
      <div className="info-title-transfer-bank">
        <h3>Thông tin ngân hàng</h3>
        <img
          alt="payment"
          height="40"
          style={{
            height: '40px',
          }}
          src="https://spaces.chuannhadat.com/icons/payment_methods/bank-transfer.png"
        />
      </div>
      <div className="p-4">
        <TableComponent columns={columns} data={data} />
      </div>
    </div>
  );
};
