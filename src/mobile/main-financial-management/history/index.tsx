'use client';

import React, { useEffect, useState } from 'react';
import {
  App,
  Page as PageContainer,
} from 'konsta/react';
import '@styles/pages/mobile/finacial-management/history.scss';

import { useBalanceRequest } from '@api/balance';
import { ITransactionResponse } from '../types';
import BalanceInfo from '../components/BalanceInfo';
import TransactionActivity from '../components/TransactionActivity';

const HistoryView = () => {
  const { fetchHistoryTransaction } = useBalanceRequest();

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

  return (
    <App theme="ios">
       <PageContainer>
        <BalanceInfo />
        <TransactionActivity title='Lịch sử nạp tiền' transactionsData={historyTransactionData} emptyText='Không có lịch sử giao dịch'/>
      </PageContainer>
    </App>
  );
};

export default HistoryView;
