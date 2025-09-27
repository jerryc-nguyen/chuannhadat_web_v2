'use client';

import React, { useEffect, useState } from 'react';

import '@styles/pages/mobile/finacial-management/history.scss';

import { useBalanceRequest } from '@common/api/balance';
import { ITransactionResponse } from '@dashboard/FinancialManagement/types';
import BalanceInfo from '@dashboard/FinancialManagement/balance/mobile/BalanceInfo';
import TransactionActivity from '@dashboard/FinancialManagement/balance/mobile/TransactionActivity';
import MobileContainer from '../../components/MobileContainer';
import { useTopUpHistoryBreadcrumb } from '@dashboard/FinancialManagement/hooks';

const HistoryView = () => {
  const { fetchHistoryTransaction } = useBalanceRequest();

  const [historyTransactionData, setHistoryTransactionData] = useState<ITransactionResponse[]>([]);

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

  // Initialize breadcrumb
  useTopUpHistoryBreadcrumb();

  return (
    <MobileContainer>
      <div className="space-y-4">
        <BalanceInfo />
        <TransactionActivity
          title="Lịch sử nạp tiền"
          transactionsData={historyTransactionData}
          emptyText="Không có lịch sử giao dịch"
        />
      </div>
    </MobileContainer>
  );
};

export default HistoryView;
