'use client';

import React from 'react';
import {
  App,
  Block,
  BlockTitle,
  Page as PageContainer,
} from 'konsta/react';
import '@styles/pages/mobile/finacial-management/recharge.scss';

import MainNav from '@mobile/header/MainNav';
import TableComponent from '@components/table';
import BalanceInfo from '../components/BalanceInfo';
import { VN_BANK } from '../constants';

const RechargeView = () => {

  const defaultData = [
    {
      bank_code: "BvBank",
      account_owner: "NGUYEN VAN LINH",
      account_number: "9021203567235",
      branch: "CN HỒ CHÍ MINH",
      content: "cnd15991"
    }
  ]
  const columns = [
    {
      title: 'Ngân hàng',
      dataIndex: 'bank_code',
      key: 'bank_code',
      render: (value: string) => {
        const bank = VN_BANK.find(vb => vb.key === value)
        return (
          <span
          >
            <strong style={{ color: "red" }}> {bank?.international_name}</strong> -
            {bank?.name}
          </span>
        )
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

  return (
    <App theme="ios">
      <PageContainer>
        <MainNav type="SearchInSub" isShowSearch={false} />

        <BalanceInfo title="Nạp tiền vào tài khoản" />

        <div className="c-recharge__content">
          <BlockTitle medium>
            Các phương thức nạp tiền
          </BlockTitle>
          <Block className='note-transfer-bank'>
            <label>Lưu ý:</label>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ margin: '8px 0' }}> - Hiện tại chúng tôi chỉ hỗ trợ: <strong>Chuyển khoản ngân hàng.</strong></li>
              <li style={{ margin: '8px 0' }}> - Nội dung chuyển tiền bạn vui lòng ghi đúng thông tin sau: <strong style={{ color: "red" }}>cnd15991</strong></li>
              <li style={{ margin: '8px 0' }}> - Nếu cần sự hỗ trợ nào khác, bạn gọi số <strong>0966662192</strong></li>
              <li style={{ margin: '8px 0' }}> - Nếu có bất tiện mong mọi người thông cảm.</li>
            </ul>
          </Block>

          <Block className='info-transfer-bank'>
            <div className='info-title-transfer-bank'>
              <h3>Chuyển khoản ngân hàng</h3>
              <img height="40" style={{
                height: "40px"
              }} src="https://spaces.chuannhadat.com/icons/payment_methods/bank-transfer.png" />
            </div>
            <TableComponent
              columns={columns}
              data={defaultData}
            />

            <div className='QR-transfer-bank text-center mt-4'>
              <h3>Quét mã QR bên dưới để thanh toán nhanh</h3>
              <h5>Vui lòng liên hệ tổng đài hỗ trợ để cập nhật thêm tiền nếu quá 24 giờ chưa thấy thay đổi số dư tài khoản</h5>

              <img src="https://img.vietqr.io/image/VCCB-9021203567235-compact2.png?addInfo=cnd15991&amp;accountName=NGUYEN VAN LINH" width="300" />
            </div>
          </Block>
        </div>
      </PageContainer>
    </App>
  );
};

export default RechargeView;
