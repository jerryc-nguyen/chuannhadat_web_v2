'use client';

import React, { useEffect, useState } from 'react';

import '@styles/pages/mobile/finacial-management/balance.scss';

import { useBalanceRequest } from '@common/api/balance';
import { ITransactionResponse } from '@dashboard/FinancialManagement/types';
import BalanceInfo from './BalanceInfo';
import TransactionActivity from './TransactionActivity';
import MobileContainer from '../../components/MobileContainer';
import { useSetAtom } from 'jotai';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  type IBreadcrumbItem,
} from '@dashboard/DashboardLayout/states/breadcrumbAtom';

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

  const setBreadCrumb = useSetAtom(breadcrumbAtom);
  React.useEffect(() => {
    const currentBreadCrumn: IBreadcrumbItem[] = [
      {
        link: '/balance-information',
        title: 'Thông tin số dư',
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
    <MobileContainer>
      <div className="space-y-4">
        <BalanceInfo />
        <TransactionActivity
          title="Biến động số dư"
          transactionsData={transactionData}
          emptyText="Không có biến động số dư"
        />
      </div>
    </MobileContainer>
  );
};

export default BalanceView;
