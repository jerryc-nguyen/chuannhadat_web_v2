'use client';

import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import '@styles/pages/mobile/finacial-management/history.scss';
import { useBalanceRequest } from '@api/balance';
import { ITransactionResponse } from '../types';
import TableComponent from '@components/table';
import NoteDescriptions from '../components/NoteDescription';
import BalanceInfo from '../components/BalanceInfo';
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
      <BalanceInfo title="Lịch sử nạp tiền" />

      <div className="c-historyFluctuation">
        <h3 className="my-4 mt-8 text-xl font-bold">Lịch sử nạp tiền của bạn</h3>
        <TableComponent columns={columns} data={historyTransactionData} />
        <NoteDescriptions />
      </div>
    </div>
  );
};

export default HistoryView;
