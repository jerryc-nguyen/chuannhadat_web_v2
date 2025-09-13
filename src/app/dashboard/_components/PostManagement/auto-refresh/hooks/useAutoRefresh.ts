import React, { MouseEvent } from 'react';
import { scheduledRefreshApi } from '@dashboard/PostManagement/auto-refresh/apis/index';
import { useAtom, useSetAtom } from 'jotai';
import { breadcrumbAtom, IBreadcrumbItem } from '@dashboard/DashboardLayout/states/breadcrumbAtom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import {
  timeRefreshAtom,
  showDialogTimePickerAtom,
  contentDialogTimerPickerAtom,
  defaultTimeRefresh,
} from '../states/autorefreshAtoms';

export const useAutoRefresh = () => {
  const [timeRefresh, setTimeRefresh] = useAtom(timeRefreshAtom);
  const setShowDialogTimePicker = useSetAtom(showDialogTimePickerAtom);
  const [contentDialogTimePicker, setContentDialogTimePicker] = useAtom(
    contentDialogTimerPickerAtom,
  );
  const [showDialogWarning, setShowDialogWarning] = React.useState<boolean>(false);
  const [overviews, setOverviews] = React.useState<Record<string, unknown>>();
  const [scheduledTimes, setScheduledTimes] = React.useState<Record<string, unknown>[]>();
  const queryClient = useQueryClient();
  const currentIdSheduleRef = React.useRef<number | null>(null);

  // Get list schedule time
  const { data, isSuccess, isFetching } = useQuery({
    queryKey: ['refresh-time'],
    queryFn: scheduledRefreshApi.getScheduledRefreshs,
  });

  // Create schedule time
  const { mutate: createMutate, isPending: isCreatePending } = useMutation({
    mutationFn: scheduledRefreshApi.createScheduledRefreshs,
    onError: (err: AxiosError) => {
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
    mutationFn: scheduledRefreshApi.deleteScheduledRefreshs,
    onError: (err: AxiosError) => {
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
    mutationFn: scheduledRefreshApi.updateScheduledRefreshs,
    onError: (err: AxiosError) => {
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

  // Setup breadcrumbs
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

  React.useEffect(() => {
    if (isSuccess) {
      const { overviews, scheduled_times } = data.data;
      setOverviews(overviews);
      setScheduledTimes(scheduled_times);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data]);

  // Handler functions
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

  return {
    // State
    timeRefresh,
    contentDialogTimePicker,
    showDialogWarning,
    overviews,
    scheduledTimes,
    isFetching,
    isLoadingDialog,
    isDeletePending,

    // Data
    data,
    isSuccess,

    // Handlers
    handleSubmitDialogTimePicker,
    handleUpdateScheduleTime,
    handleAddScheduleTime,
    handleShowDialogWarning,
    onDissmisDialogWarning,
    setShowDialogWarning,
    handleSubmitDeleteSchedule
  };
};
