import { useAtom } from 'jotai';
import {
  pageAtom,
  perPageAtom,
  notificationsDataAtom,
  totalAtom,
  filterStatusAtom,
} from '../states';
import { useNotificationRequest } from '@api/notification';
import { INotificationResponse } from '../types';
import { useCallback } from 'react';
import useAuth from '@mobile/auth/hooks/useAuth';

// Custom hook to manage notifications data
export function usePaginatedNotifications() {
  const { currentUser } = useAuth();
  const [page, setPage] = useAtom(pageAtom);
  const [perPage] = useAtom(perPageAtom);
  const [total, setTotal] = useAtom(totalAtom);
  const [filter, setFilter] = useAtom(filterStatusAtom);
  const [notifications, setNotifications] = useAtom(notificationsDataAtom);

  const { fetchNotification } = useNotificationRequest();

  const fetchNotifications = useCallback(
    async (page: number, filter: 'read' | 'unread' | null, isFirstLogin: boolean = false) => {
      if (!currentUser && !isFirstLogin) return;

      try {
        const response = await fetchNotification({
          page,
          per_page: perPage,
          filter_status: filter,
        });

        // Only set new notifications if we're not resetting due to a filter change
        let newNotifications: INotificationResponse[] = response.results
        setNotifications((prevNotifications) => {
          if (page !== 1) {
            const existingIds = new Set(notifications.map((notification) => notification.id));
            const notifyTemp = response.results.filter(
              (notification: INotificationResponse) => !existingIds.has(notification.id),
            );

            newNotifications = [...prevNotifications, ...notifyTemp]

            return newNotifications;
          }
          
          return newNotifications;
        });

        const totalCount =
          filter !== null
            ? response.total_count
            : newNotifications.filter((res: INotificationResponse) => !res.is_read).length;

        setTotal(totalCount);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    },
    [currentUser, fetchNotification, notifications, perPage, setNotifications, setTotal],
  );

  const loadMore = useCallback(
    (isFirstLogin?: boolean) => {
      if (currentUser || isFirstLogin) {
        setPage(page + 1);
        fetchNotifications(page, filter, isFirstLogin);
      }
    },
    [currentUser, fetchNotifications, filter, setPage],
  );

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
    loadMore,
    onFilter,
  };
}
