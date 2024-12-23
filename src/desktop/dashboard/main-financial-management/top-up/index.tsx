'use client';

import React from 'react';
import '@styles/pages/desktop/finacial-management/top-up.scss';

import TableComponent from '@components/table';
import BalanceInfo from '../components/BalanceInfo';
import { VN_BANK } from '../constants';
import { useDepositModal } from '@components/ui/DepositModal';
import useAuth from '@mobile/auth/hooks/useAuth';

const TopUpView = () => {
  const defaultData = [
    {
      bank_code: 'BvBank',
      account_owner: 'NGUYEN VAN LINH',
      account_number: '9021203567235',
      branch: 'CN HỒ CHÍ MINH',
      content: 'cnd15991',
    },
  ];
  const columns = [
    {
      title: 'Ngân hàng',
      dataIndex: 'bank_code',
      key: 'bank_code',
      render: (value: string) => {
        const bank = VN_BANK.find((vb) => vb.key === value);
        return (
          <span>
            <strong style={{ color: 'red' }}> {bank?.international_name}</strong> -{bank?.name}
          </span>
        );
      },
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'account_owner',
      key: 'account_owner',
      render: (value: string) => (
        <span
          style={{
            textTransform: 'uppercase',
          }}
        >
          {value}
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
      render: (value: string) => (
        <span
          style={{
            textTransform: 'uppercase',
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: 'Nội dung chuyển khoản',
      dataIndex: 'content',
      key: 'content',
      render: (value: string) => (
        <span
          style={{
            color: 'red',
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  const { isOpenDepositModal, statusTransaction, checkDepositMutate } = useDepositModal();
  const { currentUser } = useAuth();

  React.useEffect(() => {
    let timmerId: NodeJS.Timeout;
    // Call Api check deposit interval when statusTransaction is false and isOpenDepositModal is false
    // Avoid call API 2 times when Modal Desposit is open
    if (!statusTransaction && !isOpenDepositModal) {
      timmerId = setInterval(() => {
        checkDepositMutate(currentUser?.last_deposit_id as number);
      }, 5000);
    }
    return () => {
      clearInterval(timmerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTransaction, isOpenDepositModal]);
  return (
    <div>
      <BalanceInfo title="Nạp tiền vào tài khoản" />

      <div className="c-top-up__content">
        <h3 className="my-4 mt-8 text-xl font-bold">Các phương thức nạp tiền</h3>
        <div className="note-transfer-bank">
          <label>Lưu ý:</label>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ margin: '8px 0' }}>
              {' '}
              - Hiện tại chúng tôi chỉ hỗ trợ: <strong>Chuyển khoản ngân hàng.</strong>
            </li>
            <li style={{ margin: '8px 0' }}>
              {' '}
              - Nội dung chuyển tiền bạn vui lòng ghi đúng thông tin sau:{' '}
              <strong style={{ color: 'red' }}>cnd15991</strong>
            </li>
            <li style={{ margin: '8px 0' }}>
              {' '}
              - Nếu cần sự hỗ trợ nào khác, bạn gọi số <strong>0966662192</strong>
            </li>
            <li style={{ margin: '8px 0' }}> - Nếu có bất tiện mong mọi người thông cảm.</li>
          </ul>
        </div>

        <div className="info-transfer-bank">
          <div className="info-title-transfer-bank">
            <h3>Chuyển khoản ngân hàng</h3>
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
            <TableComponent columns={columns} data={defaultData} />
          </div>

          <div className="QR-transfer-bank mb-12 mt-4 flex flex-col items-center gap-y-2">
            <h3>Quét mã QR bên dưới để thanh toán nhanh</h3>
            <h5 className="max-w-full px-2 text-center md:max-w-[60%]">
              Vui lòng liên hệ tổng đài hỗ trợ để cập nhật thêm tiền nếu quá 24 giờ chưa thấy thay
              đổi số dư tài khoản
            </h5>

            <img
              alt="Nguyen Van Linh"
              src="https://img.vietqr.io/image/VCCB-9021203567235-compact2.png?addInfo=cnd15991&amp;accountName=NGUYEN VAN LINH"
              width="300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpView;
