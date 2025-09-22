'use client';
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
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
import { DialogTimePicker } from '@dashboard/PostManagement/auto-refresh/components';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

const AutoRefreshMobile: React.FC = () => {
  const {
    contentDialogTimePicker: _contentDialogTimePicker,
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
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-900">Thêm thời gian</h2>
      <Button
        onClick={handleAddScheduleTime}
        className="w-full h-14 flex items-center justify-center gap-x-3 bg-blue-500 text-lg font-medium hover:bg-blue-600 rounded-xl shadow-sm"
      >
        <Plus className="h-6 w-6" />
        Thêm thời gian
      </Button>
    </div>
  );

  const numberRefreshPost = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Số lần làm mới</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 mb-1">Miễn phí</CardTitle>
            {isFetching ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <CardDescription className="text-3xl font-bold text-blue-600">
                {overviews?.free_refresh_count as React.ReactNode}
                <span className="text-sm font-normal text-gray-500 ml-1">lần</span>
              </CardDescription>
            )}
          </CardHeader>
        </Card>
        <Card className="border-2 border-yellow-100 hover:border-yellow-200 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 mb-1">Đã mua</CardTitle>
            {isFetching ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <CardDescription className="text-3xl font-bold text-yellow-600">
                {overviews?.paid_refresh_count as React.ReactNode}
                <span className="text-sm font-normal text-gray-500 ml-1">lần</span>
              </CardDescription>
            )}
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  const refreshSettingsTable = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Lịch cài đặt</h2>

      {isFetching ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : scheduledTimes?.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500 text-lg">Chưa có lịch cài đặt nào</p>
          <p className="text-gray-400 text-sm mt-1">Nhấn &quot;Thêm thời gian&quot; để tạo lịch mới</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scheduledTimes?.map((schedule: A) => (
            <div key={schedule.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-lg font-semibold text-gray-900">
                    {schedule.formatted_time}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdateScheduleTime(schedule.id, schedule.formatted_time)}
                    className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                    size="sm"
                  >
                    <ClipboardEdit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button
                    onClick={() => handleShowDialogWarning(schedule.id)}
                    className="h-10 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDialogScheduleTime = () => (
    <DialogTimePicker
      isLoadingSubmit={isLoadingDialog}
      handleSubmit={(e) => handleSubmitDialogTimePicker(e)}
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
            onClick={handleSubmitDeleteSchedule}
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
    <section className="flex flex-col gap-y-8 p-4 pb-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cài đặt tự động làm mới</h1>
        <p className="text-gray-600">Quản lý lịch làm mới bài đăng tự động</p>
      </div>
      {addTimeRefresh()}
      {numberRefreshPost()}
      {refreshSettingsTable()}
      {renderDialogScheduleTime()}
      {renderDialogWarning()}
    </section>
  );
};

export default AutoRefreshMobile;
