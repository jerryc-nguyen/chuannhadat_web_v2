import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { v4 as uuidv4 } from 'uuid';
import emptyImageData from '@assets/images/empty.png';
import React from 'react';
import { CommonTableViewProps } from './CommonTableView.type';
import { Skeleton } from '@components/ui/skeleton';
import Image from 'next/image';
import { cn } from '@common/utils';
import TooltipHost from '@components/tooltip-host';

const CommonTableView: React.FC<CommonTableViewProps> = (props) => {
  const { columns, items, isLoading } = props;
  const renderLoadingTable = (key: string | number) => (
    <TableRow key={key}>
      {columns.map((column) => (
        <TableCell key={column.key}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
  const onRenderEmptyTable = () => {
    return (
      <TableCaption className="bg-slate-100 py-4 dark:bg-slate-700">
        <Image width={100} alt="empty-data" className="mb-4" src={emptyImageData} />
        Không có dữ liệu hiển thị
      </TableCaption>
    );
  };
  const onRenderTableBody = () => {
    if (isLoading) {
      return <TableBody>{[1, 2, 3, 4].map(() => renderLoadingTable(uuidv4()))}</TableBody>;
    } else if (items.length === 0 || !items) {
      return onRenderEmptyTable();
    } else {
      return (
        <TableBody>
          {items.map((item, index) => {
            return (
              <TableRow key={uuidv4()}>
                {columns.map((column) => (
                  <TableCell
                    key={uuidv4()}
                    className={cn('truncate font-medium', column.classNameRow)}
                  >
                    {column.onRenderItemColumn ? (
                      column.onRenderItemColumn(item, index)
                    ) : (
                      <TooltipHost isOverflow content={item[column.key]}>
                        {item[column.key]}
                      </TooltipHost>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      );
    }
  };
  return (
    <Table className="w-full overflow-hidden">
      <TableHeader>
        <TableRow className="whitespace-nowrap font-semibold">
          {columns.map((item) => (
            <TableHead key={uuidv4()} className={item.className}>
              <TooltipHost isOverflow content={item.name}>
                {item.name}
              </TooltipHost>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {onRenderTableBody()}
    </Table>
  );
};

export default CommonTableView;
