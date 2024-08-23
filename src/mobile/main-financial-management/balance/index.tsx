'use client';

import React, { useEffect, useState } from 'react';
import {
  App,
  BlockTitle,
  Page as PageContainer,
} from 'konsta/react';
import { format, parseISO } from 'date-fns';
import '@styles/pages/mobile/finacial-management/balance.scss';

import MainNav from '@mobile/header/MainNav';
import { useBalance } from '@api/balance';
import { ITransactionResponse } from '../states';
import TableComponent from '@components/table';
import NoteDescriptions from '../components/NoteDescription';
import BalanceInfo from '../components/BalanceInfo';

const BalanceView = () => {
  const { fetchTransaction } = useBalance();

  const [transactionData, setTransactionData] = useState<
    ITransactionResponse[]
  >([]);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const result = await fetchTransaction();
        setTransactionData(result.data);
      } catch (error) {
        console.error('Error loading transaction', error);
      }
    };

    loadTransaction();
  }, [fetchTransaction]);

  const columns = [
    {
      title: 'Mã giao dịch',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tài khoản',
      dataIndex: 'account_type',
      key: 'account_type',
    },
    {
      title: 'Số tiền',
      dataIndex: 'formatted_amount',
      key: 'formatted_amount',
      render: (value: string) => (
        <span
          style={{
            color: value[0] === '+' ? '#28a745' : 'red',
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (value: string) => (
        <>{format(parseISO(value), 'dd/MM/yyyy HH:mm')}</>
      ),
    },
  ];

  return (
    <App theme="ios">
      <PageContainer>
        <MainNav type="SearchInSub" isShowSearch={false} />

        <BalanceInfo title="Thông tin số dư" />

        <div className="c-balanceFluctuation">
          <BlockTitle medium>Biến động số dư</BlockTitle>
          <TableComponent
            columns={columns}
            data={transactionData}
          />
          <NoteDescriptions />
        </div>
      </PageContainer>
    </App>
  );
};

export default BalanceView;
