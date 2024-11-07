'use client';
import { services } from '@api/services';
import EmptyTable from '@components/empty-table';
import { Skeleton } from '@components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

type CallbackPageProps = object;

const CallbackPage: React.FC<CallbackPageProps> = () => {
  const { data: listRequest, isPending } = useQuery({
    queryKey: ['get-list-request'],
    queryFn: services.manage_contacts.getListRequest,
    select: (data) => data.data,
  });
  const onRenderShimmer = () => {
    return (
      <TableBody>
        {new Array(4).fill(0).map((item, index) => (
          <TableRow key={index}>
            <TableCell className="w-fit font-medium">
              <Skeleton className="h-4 w-14" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-14" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };
  const onRenderDataTable = () => {
    if (listRequest?.length === 0) {
      return <EmptyTable />;
    } else {
      return (
        <TableBody>
          {listRequest?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="w-fit font-medium">{item.id}</TableCell>
              <TableCell className="w-fit">{item.full_name}</TableCell>
              <TableCell className="w-[120px]">{item.phone}</TableCell>
              <TableCell className="w-[200px]">{item.email}</TableCell>
              <TableCell className="max-w-56 overflow-hidden truncate">
                {onRenderTooltip(item.content)}
              </TableCell>
              <TableCell>{item.formatted_created_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
  };
  const onRenderTooltip = (value: string) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger className="w-full truncate">{value}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-64 overflow-hidden text-wrap">
          <p className="text-center">{value}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  return (
    <section className="rounded-md bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Danh sách yêu cầu</h1>
      <Table className="overflow-y-auto">
        <TableHeader>
          <TableRow className="whitespace-nowrap font-semibold">
            <TableHead>ID</TableHead>
            <TableHead>Người gửi</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Thời gian</TableHead>
          </TableRow>
        </TableHeader>
        {isPending ? onRenderShimmer() : onRenderDataTable()}
      </Table>
    </section>
  );
};

export default CallbackPage;
