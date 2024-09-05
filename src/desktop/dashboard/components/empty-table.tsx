import { TableCaption } from '@components/ui/table';
import React from 'react';
import emptyImageData from '@assets/images/empty.png';
import Image from 'next/image';

const EmptyTable: React.FC = () => {
  return (
    <TableCaption className="bg-slate-100 py-4 dark:bg-slate-700">
      <Image width={100} alt="empty-data" className="mb-4" src={emptyImageData} />
      Không có dữ liệu hiển thị
    </TableCaption>
  );
};

export default EmptyTable;
