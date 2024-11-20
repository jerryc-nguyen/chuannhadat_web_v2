'use client';
import { services } from '@api/services';
import { IColumnTable } from '@components/common-table';
import CommonTableView from '@components/common-table/CommonTableView';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

type CallbackPageProps = object;

const CallbackPage: React.FC<CallbackPageProps> = () => {
  const { data: listRequest, isPending } = useQuery({
    queryKey: ['get-list-request'],
    queryFn: services.manage_contacts.getListRequest,
    select: (data) => data.data,
  });

  const columns: IColumnTable[] = [
    {
      key: 'id',
      name: 'ID',
    },
    {
      key: 'full_name',
      name: 'Người gửi',
    },
    {
      key: 'phone',
      name: 'Số điện thoại',
    },
    {
      key: 'email',
      name: 'Email',
    },
    {
      key: 'content',
      classNameRow: 'max-w-56',
      name: 'Nội dung',
    },
    {
      key: 'formatted_created_at',
      name: 'Thời gian',
    },
  ];
  return (
    <section className="rounded-md bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Danh sách yêu cầu</h1>
      <CommonTableView columns={columns} isLoading={isPending} items={listRequest as A[]} />
    </section>
  );
};

export default CallbackPage;
