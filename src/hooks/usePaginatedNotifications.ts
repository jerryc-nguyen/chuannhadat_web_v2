/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from 'jotai';

import { useNotificationRequest } from '@api/notification';
import React, { useCallback } from 'react';
import useAuth from '@mobile/auth/hooks/useAuth';
import { INotificationResponse } from '@models/modelResponse';
import {
  currentToltalAtom,
  filterStatusAtom,
  notificationsDataAtom,
  pageAtom,
  perPageAtom,
  totalAtom,
  totalUnreadAtom,
} from '@mobile/notification/states';

// Custom hook to manage notifications data
export function usePaginatedNotifications() {
  const { currentUser } = useAuth();
  const [page, setPage] = useAtom(pageAtom);
  const [perPage] = useAtom(perPageAtom);
  const [total, setTotal] = useAtom(totalAtom);
  const [currentToltal, setCurrentTotal] = useAtom(currentToltalAtom);
  const [totalNotificationlUnread, setTotalNotificationUnread] = useAtom(totalUnreadAtom);
  const [filter, setFilter] = useAtom(filterStatusAtom);
  const [notifications, setNotifications] = useAtom(notificationsDataAtom);

  const { fetchNotification } = useNotificationRequest();

  const fetchNotifications = useCallback(
    async (page: number, filter: 'read' | 'unread' | null) => {
      if (!currentUser) return;

      try {
        const response = await fetchNotification({
          page,
          per_page: perPage,
          filter_status: filter,
        });

        // Only set new notifications if we're not resetting due to a filter change
        let newNotifications: INotificationResponse[] = response?.results;
        setNotifications((prevNotifications) => {
          if (page !== 1) {
            const existingIds = new Set(notifications.map((notification) => notification.id));
            const notifyTemp = response.results.filter(
              (notification: INotificationResponse) => !existingIds.has(notification.id),
            );

            newNotifications = [...prevNotifications, ...notifyTemp];

            return newNotifications;
          }

          return newNotifications;
        });
        if (!filter) {
          setTotal(response.total_count);
        }
        setCurrentTotal(response.total_count);
        setTotalNotificationUnread(
          newNotifications.filter((res: INotificationResponse) => !res.is_read).length,
        );
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, notifications, perPage, setTotal],
  );

  const loadMore = useCallback(() => {
    if (currentUser) {
      setPage((page) => page + 1);
      fetchNotifications(page + 1, filter);
    }
  }, [currentUser, filter, page]);

  const isMarkAllRead = React.useMemo(() => {
    return notifications.every((notification) => notification.is_read);
  }, [notifications]);

  const onFilter = useCallback(
    (status: 'read' | 'unread' | null) => {
      setPage(1); // Reset to the first page when filter changes
      setFilter(status);
      fetchNotifications(1, status); // Fetch notifications for the first page with the new filter
    },
    [fetchNotifications, setPage, setFilter],
  );

  return {
    notifications,
    total,
    currentToltal,
    isMarkAllRead,
    loadMore,
    onFilter,
    totalNotificationlUnread,
  };
}
