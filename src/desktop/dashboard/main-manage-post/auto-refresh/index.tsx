'use client';
import React, { MouseEvent } from 'react';
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
import { LuClipboardEdit, LuPlus, LuTrash2 } from 'react-icons/lu';
import { useAtom, useSetAtom } from 'jotai';
import { breadcrumbAtom, IBreadcrumbItem } from '@desktop/dashboard/states/breadcrumbAtom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { toast } from 'sonner';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Skeleton } from '@components/ui/skeleton';
import { AxiosError } from 'axios';
import {
  timeRefreshAtom,
  showDialogTimePickerAtom,
  contentDialogTimerPickerAtom,
  defaultTimeRefresh,
} from '@desktop/dashboard/main-manage-post/states/autorefreshAtoms';

import EmptyTable from '@components/empty-table';
import { DialogTimePicker } from './components';
import { services } from '../apis';
import CardPackage from '@components/ui/CardPackage';

type AutoRefreshDesktopProps = object;

const AutoRefreshDesktop: React.FC<AutoRefreshDesktopProps> = () => {
  const [timeRefresh, setTimeRefresh] = useAtom(timeRefreshAtom);
  const setShowDialogTimePicker = useSetAtom(showDialogTimePickerAtom);
  const [contentDialogTimePicker, setContentDialogTimePicker] = useAtom(
    contentDialogTimerPickerAtom,
  );
  const [showDialogWarning, setShowDialogWarning] = React.useState<boolean>(false);
  const [overviews, setOverviews] = React.useState<A>();
  const [scheduledTimes, setScheduledTimes] = React.useState<A>();
  const queryClient = useQueryClient();
  const currentIdSheduleRef = React.useRef<number | null>(null);
  // Get list schedule time
  const { data, isSuccess, isFetching } = useQuery({
    queryKey: ['refresh-time'],
    queryFn: services.scheduledRefreshs.getScheduledRefreshs,
  });

  // Create schedule time
  const { mutate: createMutate, isPending: isCreatePending } = useMutation({
    mutationFn: services.scheduledRefreshs.createScheduledRefreshs,
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching create', err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refresh-time'] });
      onSuccessScheduleTime();
      toast.success('Thêm thời gian thành công');
    },
  });

  // Delete schedule time
  const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
    mutationFn: services.scheduledRefreshs.deleteScheduledRefreshs,
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching delete', err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refresh-time'] });
      setShowDialogWarning(false);
      toast.success('Xóa thời gian thành công');
    },
  });
  // Update schedule time
  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: services.scheduledRefreshs.updateScheduledRefreshs,
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching update', err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refresh-time'] });
      onSuccessScheduleTime();
      toast.success('Cập nhật thời gian thành công');
    },
  });

  const isLoadingDialog = React.useMemo(
    () => isCreatePending || isUpdatePending,
    [isCreatePending, isUpdatePending],
  );
  React.useEffect(() => {
    if (isSuccess) {
      const { overviews, scheduled_times } = data.data;
      setOverviews(overviews);
      setScheduledTimes(scheduled_times);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data]);
  const setBreadCrumb = useSetAtom(breadcrumbAtom);

  React.useEffect(() => {
    const currentBreadCrumn: IBreadcrumbItem[] = [
      {
        link: '/manage-post',
        title: 'Quản lý tin đăng',
        isActive: true,
      },
      {
        link: '/auto-refresh',
        title: 'Tự động làm mới',
        isActive: true,
      },
    ];
    setBreadCrumb((state) => [...state, ...currentBreadCrumn]);
    return () => {
      setBreadCrumb((state) => state.slice(0, -2));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render method handler
  const onSuccessScheduleTime = () => {
    setShowDialogTimePicker(false);
    setTimeRefresh(defaultTimeRefresh);
    setContentDialogTimePicker(undefined);
  };

  const handleSubmitAddSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [hour, minute] = timeRefresh.split(':');
    createMutate({
      hour,
      minute,
    });
  };
  const handleSubmitUpdateSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [hour, minute] = timeRefresh.split(':');
    const scheduleId = currentIdSheduleRef?.current;
    updateMutate({
      id: scheduleId as number,
      hour,
      minute,
    });
  };
  const handleSubmitDeleteSchedule = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const scheduleId = currentIdSheduleRef?.current;
    deleteMutate(scheduleId as number);
  };
  const handleSubmitDialogTimePicker = (e: React.FormEvent<HTMLFormElement>) => {
    if (contentDialogTimePicker?.type === 'add') {
      handleSubmitAddSchedule(e);
    } else {
      handleSubmitUpdateSchedule(e);
    }
    currentIdSheduleRef.current = null;
  };
  const handleUpdateScheduleTime = (id: number, formatedTime: string) => {
    currentIdSheduleRef.current = id;
    setTimeRefresh(formatedTime.slice(0, 5));
    setContentDialogTimePicker({ buttonSubmit: 'Cập nhật', type: 'update' });
    setShowDialogTimePicker(true);
  };
  const handleAddScheduleTime = () => {
    setContentDialogTimePicker({ buttonSubmit: 'Thêm', type: 'add' });
    setShowDialogTimePicker(true);
  };
  const handleShowDialogWarning = (id: number) => {
    currentIdSheduleRef.current = id;
    setShowDialogWarning(true);
  };
  const onDissmisDialogWarning = () => {
    currentIdSheduleRef.current = null;
  };
  // Render components
  const addTimeRefresh = () => (
    <div>
      <h2 className="mb-4 border-l-4 border-slate-500 pl-2 text-lg font-medium">Thêm thời gian</h2>
      <Button
        onClick={handleAddScheduleTime}
        className="flex items-center gap-x-2 bg-blue-500 hover:bg-blue-600"
      >
        <LuPlus />
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
                {overviews?.free_refresh_count} lần
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
                {overviews?.paid_refresh_count} lần
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
                  <LuClipboardEdit className="mr-2" />
                  Cập nhật
                </Button>
                <Button disabled className="bg-red-500 hover:bg-red-600">
                  <LuTrash2 className="mr-2" />
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
                    <LuClipboardEdit className="mr-2" />
                    Cập nhật
                  </Button>
                  <Button
                    onClick={() => handleShowDialogWarning(schedule.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <LuTrash2 className="mr-2" />
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

  const refeshListPackage = () => (
    <div>
      <h2 className="mb-4 border-l-4 border-slate-500 pl-2 text-lg font-medium">
        Các gói đăng tin
      </h2>
      <div className="flex flex-col gap-x-4 gap-y-4 lg:flex-row">
        <CardPackage
          cardTitle="Gói làm mới 1"
          pricePackage="100 Xu"
          unitTime="tháng"
          description="Gói làm mới tin đăng giúp bạn tiết kiệm thời gian và đẩy tin lên top"
          listPreferential={['Số lần làm mới tin: 300']}
        />
        <CardPackage
          cardTitle="Gói làm mới 2"
          pricePackage="200 Xu"
          unitTime="tháng"
          description="Gói làm mới tin đăng giúp bạn tiết kiệm thời gian và đẩy tin lên top"
          listPreferential={['Số lần làm mới tin: 800']}
        />
        <CardPackage
          cardTitle="Gói làm mới 3"
          pricePackage="500 Xu"
          unitTime="tháng"
          description="Gói làm mới tin đăng giúp bạn tiết kiệm thời gian và đẩy tin lên top"
          listPreferential={['Số lần làm mới tin: 2000']}
        />
      </div>
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
            onClick={(event) => handleSubmitDeleteSchedule(event as MouseEvent<HTMLButtonElement>)}
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
      {refeshListPackage()}
      {renderDialogScheduleTime()}
      {renderDialogWarning()}
    </section>
  );
};

export default AutoRefreshDesktop;
