'use client';

import '@styles/pages/mobile/finacial-management/balance.scss';
import { format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';

import { useBalanceRequest } from '@common/api/balance';
import TableComponent from '@components/table';
import BalanceInfo from './BalanceInfo';
import NoteDescriptions from '../history/NoteDescription';
import { ITransactionResponse } from '../types';
import { useBalanceSummaryBreadcrumb } from '@dashboard/FinancialManagement/hooks';

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
      render: (value: string) => <>{format(parseISO(value), 'dd/MM/yyyy HH:mm')}</>,
    },
  ];

  // Initialize breadcrumb
  useBalanceSummaryBreadcrumb();

  return (
    <div>
      <BalanceInfo title="Thông tin số dư" />
      <h3 className="mb-4 text-2xl font-bold">Biến động số dư</h3>
      <TableComponent columns={columns} data={transactionData} />
      <NoteDescriptions />
    </div>
  );
};

export default BalanceView;
