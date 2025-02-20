'use client';

import React, { useEffect, useState } from 'react';

import '@styles/pages/mobile/finacial-management/history.scss';

import { useBalanceRequest } from '@api/balance';
import { ITransactionResponse } from '../types';
import BalanceInfo from '../components/BalanceInfo';
import TransactionActivity from '../components/TransactionActivity';
import { useSetAtom } from 'jotai';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  type IBreadcrumbItem,
} from '@views/dashboard/states/breadcrumbAtom';

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

  const setBreadCrumb = useSetAtom(breadcrumbAtom);
  React.useEffect(() => {
    const currentBreadCrumn: IBreadcrumbItem[] = [
      {
        link: '/recharge-history',
        title: 'Lịch sử nạp tiền',
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
      <BalanceInfo />
      <TransactionActivity
        title="Lịch sử nạp tiền"
        transactionsData={historyTransactionData}
        emptyText="Không có lịch sử giao dịch"
      />
    </div>
  );
};

export default HistoryView;
