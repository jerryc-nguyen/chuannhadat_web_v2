'use client';
import React from 'react';
import '@styles/pages/desktop/finacial-management/top-up.scss';
import TableComponent from '@components/table';
import BalanceInfo from '../components/BalanceInfo';
import { useDepositModal } from '@components/ui/DepositModal';
import useAuth from '@mobile/auth/hooks/useAuth';
import {
  BANK_ACCOUNT_NAME,
  BANK_ACCOUNT_NUMBER,
  BANK_CODE,
  BANK_FULL_NAME,
  SMS_SUPPORT_NUMBER,
} from '@common/constants';
import { useSetAtom } from 'jotai';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  type IBreadcrumbItem,
} from '@desktop/dashboard/states/breadcrumbAtom';

const TopUpView = () => {
  const { currentUser, bankTransferNote } = useAuth();

  const defaultData = [
    {
      bank_code: BANK_CODE,
      account_owner: BANK_ACCOUNT_NAME,
      account_number: BANK_ACCOUNT_NUMBER,
      branch: 'CN HỒ CHÍ MINH',
      content: bankTransferNote,
    },
  ];

  const columns = [
    {
      title: 'Ngân hàng',
      dataIndex: 'bank_code',
      key: 'bank_code',
      render: (value: string) => {
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
      render: (value: string) => (
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
          {bankTransferNote}
        </span>
      ),
    },
  ];

  const { isOpenDepositModal, statusTransaction, checkDepositMutate } = useDepositModal();

  React.useEffect(() => {
    let timmerId: NodeJS.Timeout;
    // Call Api check deposit interval when statusTransaction is false and isOpenDepositModal is false
    // Avoid call API 2 times when Modal Desposit is open
    if (!statusTransaction && !isOpenDepositModal) {
      timmerId = setInterval(() => {
        checkDepositMutate(currentUser?.last_credit_id as number);
      }, 5000);
    }
    return () => {
      clearInterval(timmerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTransaction, isOpenDepositModal, currentUser]);
  const setBreadCrumb = useSetAtom(breadcrumbAtom);
  React.useEffect(() => {
    const currentBreadCrumn: IBreadcrumbItem[] = [
      {
        link: '/to-up',
        title: 'Nạp tiền vào tài khoản',
        isActive: true,
      },
    ];
    setBreadCrumb((state) => [...state, ...currentBreadCrumn]);
    return () => {
      setBreadCrumb(defaultBreadcrumb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <BalanceInfo title="Nạp tiền vào tài khoản" />

      <div className="c-top-up__content">
        <h3 className="my-4 mt-8 text-xl font-bold">Nạp tiền bằng QR - Chuyển khoản ngân hàng</h3>
        <div className="note-transfer-bank">
          <label>Lưu ý:</label>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ margin: '8px 0' }}>
              {' '}
              Ghi đúng nội dung chuyển khoản: {' '}
              <strong style={{ color: 'red' }}>{bankTransferNote}</strong>
            </li>
            <li style={{ margin: '8px 0' }}>
              <p className="my-2">
                Nếu có vấn đề trong khi thanh toán - thường là không nhập đúng nội dung CK, bạn gọi
                hỗ trợ <b className="text-primary_color">{SMS_SUPPORT_NUMBER}</b>
              </p>
            </li>
            <li>
              Vui lòng gọi hỗ trợ để cập nhật thêm tiền nếu quá 5 phút mà chưa thấy thay đổi số dư
              tài khoản
            </li>
          </ul>
        </div>

        <div className="mb-12 mt-4 flex flex-col items-center gap-y-2">
          <h3 className="mb-2 text-xl font-bold">Quét mã QR để thanh toán</h3>

          <img
            alt="Nguyen Van Linh"
            src={`https://img.vietqr.io/image/TPB-51938398888-compact2.png?addInfo=${bankTransferNote}&accountName=NGUYEN%20VAN%20LINH`}
            width="300"
          />
        </div>

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
            <TableComponent columns={columns} data={defaultData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpView;
