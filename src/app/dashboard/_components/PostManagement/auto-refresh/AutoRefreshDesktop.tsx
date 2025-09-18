'use client';
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@components/ui/button';
import { ClipboardEdit, Plus, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { ReloadIcon } from '@radix-ui/react-icons';
import { Skeleton } from '@components/ui/skeleton';
import EmptyTable from '@components/empty-table';
import { DialogTimePicker } from './components';
import { useAutoRefresh } from './hooks/useAutoRefresh';

type AutoRefreshDesktopProps = object;

const AutoRefreshDesktop: React.FC<AutoRefreshDesktopProps> = () => {
  const {
    contentDialogTimePicker,
    showDialogWarning,
    overviews,
    scheduledTimes,
    isFetching,
    isLoadingDialog,
    isDeletePending,
    handleSubmitDialogTimePicker,
    handleUpdateScheduleTime,
    handleAddScheduleTime,
    handleShowDialogWarning,
    onDissmisDialogWarning,
    setShowDialogWarning,
    handleSubmitDeleteSchedule,
  } = useAutoRefresh();
  // Render components
  const addTimeRefresh = () => (
    <div>
      <h2 className="mb-4 border-l-4 border-slate-500 pl-2 text-lg font-medium">Thêm thời gian</h2>
      <Button
        onClick={handleAddScheduleTime}
        className="flex items-center gap-x-2 bg-blue-500 hover:bg-blue-600"
      >
        <Plus />
        Thêm thời gian
      </Button>
    </div>
  );

  const numberRefreshPost = () => (
    <div>
      <h2 className="mb-4 border-l-4 border-slate-500 pl-2 text-lg font-medium">Số lần làm mới</h2>
      <div className="mt-2 flex w-full justify-between gap-x-4 md:w-2/3 lg:w-1/2">
        <Card className="flex-1 hover:bg-blue-50">
          <CardHeader>
            <CardTitle className="dark:text-slate-400">Miễn phí</CardTitle>
            {isFetching ? (
              <Skeleton className="h-[32px] w-[100px]" />
            ) : (
              <CardDescription className="text-2xl font-bold text-blue-500">
                {overviews?.free_refresh_count as React.ReactNode} lần
              </CardDescription>
            )}
          </CardHeader>
        </Card>
        <Card className="flex-1 hover:bg-yellow-100">
          <CardHeader>
            <CardTitle className="dark:text-slate-400">Đã mua</CardTitle>
            {isFetching ? (
              <Skeleton className="h-[32px] w-[100px]" />
            ) : (
              <CardDescription className="text-2xl font-bold text-yellow-500">
                {overviews?.paid_refresh_count as React.ReactNode} lần
              </CardDescription>
            )}
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  const refreshSettingsTable = () => (
    <div>
      <h2 className="mb-4 border-l-4 border-slate-500 pl-2 text-lg font-medium">
        Bảng cài đặt thời gian
      </h2>

      <Table className="max-w-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="text-base font-bold">Thời gian</TableHead>
            <TableHead className="text-base font-bold">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetching ? (
            <TableRow>
              <TableCell className="text-sm">Đang tải...</TableCell>
              <TableCell>
                <Button disabled className="mr-2 bg-green-500 hover:bg-green-600">
                  <ClipboardEdit className="mr-2" />
                  Cập nhật
                </Button>
                <Button disabled className="bg-red-500 hover:bg-red-600">
                  <Trash2 className="mr-2" />
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            scheduledTimes?.map((schedule: A) => (
              <TableRow key={schedule.id}>
                <TableCell className="text-sm">{schedule.formatted_time}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleUpdateScheduleTime(schedule.id, schedule.formatted_time)}
                    className="mr-2 bg-green-500 hover:bg-green-600"
                  >
                    <ClipboardEdit className="mr-2" />
                    Cập nhật
                  </Button>
                  <Button
                    onClick={() => handleShowDialogWarning(schedule.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="mr-2" />
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {!isFetching && scheduledTimes?.length === 0 && <EmptyTable />}
      </Table>
    </div>
  );

  const renderDialogScheduleTime = () => (
    <DialogTimePicker
      isLoadingSubmit={isLoadingDialog}
      handleSubmit={(e: EventInput) => handleSubmitDialogTimePicker(e)}
      type="add"
    />
  );
  const renderDialogWarning = () => (
    <AlertDialog onOpenChange={setShowDialogWarning} open={showDialogWarning}>
      <AlertDialogContent onCloseAutoFocus={onDissmisDialogWarning}>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa lịch cập nhật này?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeletePending}
            onClick={(event) => handleSubmitDeleteSchedule(event as React.MouseEvent<HTMLButtonElement>)}
          >
            {isDeletePending ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              'Xóa'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return (
    <section className="flex flex-col gap-y-6 rounded-md bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold">Cài đặt tự động làm mới</h1>
      {addTimeRefresh()}
      {numberRefreshPost()}
      {refreshSettingsTable()}
      {renderDialogScheduleTime()}
      {renderDialogWarning()}
    </section>
  );
};

export default AutoRefreshDesktop;
