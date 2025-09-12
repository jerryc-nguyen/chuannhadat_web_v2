/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from 'jotai';
import React from 'react';
import { useAuth } from '@common/auth/AuthContext';
import { notificationsDataAtom, totalAtom, totalUnreadAtom } from '../states';
import { useMutation } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';
import type { AxiosError } from 'axios';
import { defaultPageNumber, defaultPageSize } from '@common/constants';
export type TypeNotification = 'read' | 'unread' | null;
// Custom hook to manage notifications data
export function usePaginatedNotifications() {
  //! States and Ref
  const { currentUser } = useAuth();
  const pageNumberRef = React.useRef(defaultPageNumber);
  const typeNotificationRef = React.useRef<TypeNotification>(null);
  const isLoadNext = React.useRef<boolean>(false);
  const [notifications, setNotifications] = useAtom(notificationsDataAtom);
  const [totalCount, setTotalCount] = useAtom(totalAtom);
  const [currentTotalCount, setCurrentTotalCount] = React.useState<number>(0);
  const [totalUnread, setTotalUnread] = useAtom(totalUnreadAtom);

  //! Mutations
  const { mutateAsync: fetchNotification } = useMutation({
    mutationFn: notificationsApi.getNotifications,
    onSuccess: (data) => {
      const notifications = data.data;
      setCurrentTotalCount(notifications.total_count);
      if (isLoadNext.current) {
        setNotifications((prev) => [...prev, ...notifications.results]);
      } else {
        setNotifications(notifications.results);
      }
    },
    onError: (err: AxiosError) => {
      console.error('Error fetching notifications', err);
    },
  });
  const { mutateAsync: makeMarkReadAll } = useMutation({
    mutationFn: notificationsApi.markAsReadAll,
    onSuccess: (data) => {
      if (data.success) {
        fetchNotification({
          page: 1,
          per_page: 10,
          filter_status: null,
        });
      }
    },
    onError: (err: AxiosError) => {
      console.error('Error marking all as read', err);
    },
  });

  const { mutateAsync: makeMarkRead } = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: (data, id) => {
      if (data.status) {
        // Update the local state to mark the notification as read
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, is_read: true }
              : notification
          )
        );
        // Update the unread count
        setTotalUnread((prev) => Math.max(0, prev - 1));
      }
    },
    onError: (err: AxiosError) => {
      console.error('Error marking notification as read', err);
    },
  });

  //! Functions
  const handleFilter = () => {
    isLoadNext.current = false;
    typeNotificationRef.current = typeNotificationRef.current === null ? 'unread' : null;
    fetchNotification({
      page: 1,
      per_page: defaultPageSize,
      filter_status: typeNotificationRef.current,
    });
  };

  const handleLoadNext = (type?: TypeNotification) => {
    if (defaultPageSize * pageNumberRef.current > totalCount) return;
    pageNumberRef.current += 1;
    isLoadNext.current = true;
    fetchNotification({
      page: pageNumberRef.current,
      per_page: defaultPageSize,
      filter_status: type || typeNotificationRef.current,
    });
  };

  const isMarkAllRead = React.useMemo(() => {
    return notifications.every((notification) => notification.is_read);
  }, [notifications]);

  //! Effects
  React.useEffect(() => {
    (async () => {
      if (currentUser?.id) {
        const data = await notificationsApi.getNotifications({
          page: pageNumberRef.current,
          per_page: 100,
          filter_status: null,
        });
        if (data && data.data) {
          setTotalCount(data.data.total_count);
          const totalUnread = data.data.results.filter((item) => !item.is_read).length;
          setTotalUnread(totalUnread);
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);
  React.useEffect(() => {
    if (currentUser?.id) {
      fetchNotification({
        page: pageNumberRef.current,
        per_page: defaultPageSize,
        filter_status: null,
      });
    }
  }, [currentUser?.id]);
  //! Return
  return {
    notifications,
    totalCount,
    isMarkAllRead,
    handleLoadNext,
    handleFilter,
    typeFilter: typeNotificationRef.current,
    makeMarkReadAll,
    makeMarkRead,
    totalUnread,
    currentTotalCount,
  };
}
