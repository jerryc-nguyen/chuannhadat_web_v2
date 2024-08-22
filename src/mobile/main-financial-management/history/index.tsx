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

const HistoryView = () => {
  const { fetchHistoryTransaction } = useBalance();

  const [
    historyTransactionData,
    setHistoryTransactionData,
  ] = useState<ITransactionResponse[]>([]);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const result = await fetchHistoryTransaction();
        setHistoryTransactionData(result.data);
      } catch (error) {
        console.error('Error loading transaction', error);
      }
    };

    loadTransaction();
  }, [fetchHistoryTransaction]);

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

        <BalanceInfo title="Lịch sử nạp tiền" />

        <div className="c-balanceFluctuation">
          <BlockTitle medium>
            Lịch sử nạp tiền của bạn
          </BlockTitle>
          <TableComponent
            columns={columns}
            data={historyTransactionData}
          />
          <NoteDescriptions />
        </div>
      </PageContainer>
    </App>
  );
};

export default HistoryView;
