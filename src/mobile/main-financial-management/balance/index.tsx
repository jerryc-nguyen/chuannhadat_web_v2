'use client';

import React, { useEffect, useState } from 'react';

import '@styles/pages/mobile/finacial-management/balance.scss';

import { useBalanceRequest } from '@api/balance';
import { ITransactionResponse } from '../types';
import BalanceInfo from '../components/BalanceInfo';
import TransactionActivity from '../components/TransactionActivity';

const BalanceView = () => {
  const { fetchTransaction } = useBalanceRequest();

  const [transactionData, setTransactionData] = useState<ITransactionResponse[]>([]);

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

  return (
    <div>
      <BalanceInfo />
      <TransactionActivity
        title="Biến động số dư"
        transactionsData={transactionData}
        emptyText="Không có biến động số dư"
      />
    </div>
  );
};

export default BalanceView;
