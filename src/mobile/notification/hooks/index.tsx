import { useAtom } from 'jotai';
import { pageAtom, perPageAtom, notificationsDataAtom, totalAtom, filterStatusAtom } from '../states'; 
import { useNotificationRequest } from '@api/notification';
import { INotificationResponse } from '../types';

// Custom hook to manage notifications data
export function usePaginatedNotifications() {
  const [page, setPage] = useAtom(pageAtom);
  const [per_page] = useAtom(perPageAtom);
  const [total, setTotal] = useAtom(totalAtom);
  const [filter, setFilter] = useAtom(filterStatusAtom);
  const [notifications, setNotifications] = useAtom(notificationsDataAtom);
  const { fetchNotification } = useNotificationRequest();

  const loadMore = async () => {
    setPage((prev) => prev + 1);
    try {
      const response = await fetchNotification({ page, per_page, filter_status: filter });
  
      const existingIds = new Set(notifications.map(notification => notification.id));
  
      const newNotifications = response.results.filter((notification: INotificationResponse) => !existingIds.has(notification.id));
  
      setNotifications(newNotifications);

      !!filter
        ? setTotal(response.total_count)
        : setTotal(response.results.filter((res: INotificationResponse) => !res.is_read).length);
    } catch (error) {
      console.error('Error loading more data:', error);
    }
  };

  const onFilter = async (status: "read" | "unread" | null) => {
    setPage(1);
    setFilter(status);
    try {
      const response = await fetchNotification({page: 1 , per_page, filter_status: status});

      setNotifications(response.results);
      !!filter ? setTotal(response.total_count) : setTotal(response.results.filter((res: INotificationResponse) => !res.is_read).length)
    } catch (error) {
      console.error('Error loading more data:', error);
    }
  }

  return {
    notifications,
    total,
    loadMore,
    onFilter
  };
}
